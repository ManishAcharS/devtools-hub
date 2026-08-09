'use client';

import React, { useMemo, useState } from 'react';
import { Container } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { SectionHeading } from '@/components/shared/section-heading';

type Stack = 'node' | 'python' | 'go' | 'static';

const STACKS: { value: Stack; label: string; description: string }[] = [
  { value: 'node', label: 'Node.js', description: 'npm build + slim runtime' },
  { value: 'python', label: 'Python', description: 'pip install + slim runtime' },
  { value: 'go', label: 'Go', description: 'static binary + scratch-alpine runtime' },
  { value: 'static', label: 'Static site', description: 'npm build + nginx' },
];

function buildNodeDockerfile(appName: string, port: string): string {
  return `FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine3.21
ENV NODE_ENV=production
ENV PORT=${port || '3000'}
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN addgroup --system app && adduser --system --ingroup app app
USER app
EXPOSE ${port || '3000'}
CMD ["node", "dist/index.js"]`;
}

function buildPythonDockerfile(appName: string, port: string): string {
  return `FROM python:3.13-alpine3.21 AS build
WORKDIR /app
COPY requirements*.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM python:3.13-alpine3.21
ENV PYTHONUNBUFFERED=1
ENV PORT=${port || '8000'}
WORKDIR /app
COPY --from=build /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=build /app .
RUN addgroup --system app && adduser --system --ingroup app app
USER app
EXPOSE ${port || '8000'}
CMD ["python", "app.py"]`;
}

function buildGoDockerfile(appName: string, port: string): string {
  const binary = appName.trim() ? appName.trim().replace(/[^a-zA-Z0-9_.-]/g, '-') : 'app';
  return `FROM golang:1.24-alpine3.21 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/${binary} .

FROM alpine:3.21
WORKDIR /app
COPY --from=build /bin/${binary} /usr/local/bin/${binary}
RUN addgroup --system app && adduser --system --ingroup app app
USER app
EXPOSE ${port || '8080'}
CMD ["${binary}"]`;
}

function buildStaticDockerfile(appName: string, port: string): string {
  return `FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html/public
EXPOSE ${port || '80'}
CMD ["nginx", "-g", "daemon off;"]`;
}

const BUILDERS: Record<Stack, (appName: string, port: string) => string> = {
  node: buildNodeDockerfile,
  python: buildPythonDockerfile,
  go: buildGoDockerfile,
  static: buildStaticDockerfile,
};

const DockerfileGenerator: React.FC<ToolComponentProps> = () => {
  const [stack, setStack] = useState<Stack>('node');
  const [appName, setAppName] = useState('my-app');
  const [port, setPort] = useState('3000');

  const output = useMemo(() => BUILDERS[stack](appName, port), [stack, appName, port]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Container className="h-6 w-6" aria-hidden="true" />}
        title="Dockerfile generator"
        description="Generate a multi-stage Dockerfile with pinned base images and a non-root runtime user for Node.js, Python, Go, or static sites."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="dockerfile-stack"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Stack
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STACKS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStack(option.value)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                stack === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted'
              }`}
              aria-pressed={stack === option.value}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="text-muted-foreground mt-1 block text-xs">{option.description}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="dockerfile-app-name"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              App name
            </label>
            <input
              id="dockerfile-app-name"
              type="text"
              value={appName}
              onChange={(event) => setAppName(event.target.value)}
              placeholder="my-app"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="dockerfile-port"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Port
            </label>
            <input
              id="dockerfile-port"
              type="text"
              inputMode="numeric"
              value={port}
              onChange={(event) => setPort(event.target.value.replace(/[^0-9]/g, ''))}
              placeholder="3000"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Dockerfile
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value={output} size="sm" />
            <DownloadButton
              content={output}
              fileName="Dockerfile"
              contentType="text/plain;charset=utf-8"
              label="Download"
              size="sm"
            />
          </div>
        </div>
        <pre className="bg-muted text-foreground mt-2 max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

DockerfileGenerator.displayName = 'DockerfileGenerator';

export { DockerfileGenerator };
