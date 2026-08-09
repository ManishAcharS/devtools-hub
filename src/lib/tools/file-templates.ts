export interface TemplateOption {
  id: string;
  label: string;
  description: string;
  content: string;
}

export const GITIGNORE_TEMPLATES: TemplateOption[] = [
  {
    id: 'node',
    label: 'Node.js',
    description: 'Dependencies, build output, logs, and IDE files.',
    content: `# Dependencies
node_modules/

# Build
dist/
build/
*.tsbuildinfo

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo
`,
  },
  {
    id: 'python',
    label: 'Python',
    description: 'Bytecode, virtual envs, test artifacts, and packaging.',
    content: `# Bytecode
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
.venv/

# Distribution
dist/
build/
*.egg-info/

# Testing
.pytest_cache/
.coverage
htmlcov/

# Type checking
.mypy_cache/
.dmypy.json
dmypy.json

# IDE
.idea/
.vscode/
*.swp
`,
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Target directory, Cargo.lock, and IDE files.',
    content: `# Build
target/

# Cargo
Cargo.lock

# IDE
.idea/
.vscode/
*.swp
`,
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Build output, vendor, and test binaries.',
    content: `# Build
*.exe
*.test
*.prof

# Vendor
vendor/

# IDE
.idea/
.vscode/
*.swp
`,
  },
  {
    id: 'java',
    label: 'Java (Maven/Gradle)',
    description: 'Build dirs, IDE, and wrapper files.',
    content: `# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml

# Gradle
.gradle/
build/

# Wrapper
gradlew.bat
gradle-wrapper.jar

# IDE
.idea/
.vscode/
*.swp
`,
  },
  {
    id: 'vscode',
    label: 'Visual Studio Code',
    description: 'VS Code specific settings.',
    content: `.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace
`,
  },
  {
    id: 'macos',
    label: 'macOS',
    description: 'System files and metadata.',
    content: `.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
VolumeIcon.icns
.com.apple.timemachine.donotpresent
`,
  },
];

export function buildGitignore(selected: string[], custom: string): string {
  const parts = selected
    .map((id) => GITIGNORE_TEMPLATES.find((t) => t.id === id)?.content)
    .filter(Boolean);
  if (custom.trim()) parts.push(custom.trim());
  return parts.join('\n\n') + '\n';
}

export const README_TEMPLATE = (params: {
  title: string;
  description: string;
  badges: string;
  install: string;
  usage: string;
  license: string;
}): string => `# ${params.title}

${params.badges}

${params.description}

## Installation

\`\`\`bash
${params.install}
\`\`\`

## Usage

\`\`\`bash
${params.usage}
\`\`\`

## License

${params.license}
`;

export const LICENSE_TEXTS: Record<string, string> = {
  mit: `MIT License

Copyright (c) {year} {author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  'apache-2.0': `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction,
and distribution as defined by Sections 1 through 9 of this document.

...

Copyright {year} {author}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,
  'gpl-3.0': `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) {year} {author}

Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.

... (full GPL-3.0 text abbreviated for brevity)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.`,
  'bsd-3': `BSD 3-Clause License

Copyright (c) {year} {author}

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.`,
  isc: `ISC License

Copyright (c) {year} {author}

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
};

export function renderLicense(licenseId: string, author: string, year: number): string {
  const template = LICENSE_TEXTS[licenseId] ?? LICENSE_TEXTS.mit;
  return template.replace(/{year}/g, String(year)).replace(/{author}/g, author);
}

export const LICENSE_OPTIONS = [
  { id: 'mit', label: 'MIT', description: 'Permissive, short, widely used.' },
  { id: 'apache-2.0', label: 'Apache 2.0', description: 'Permissive with patent grant.' },
  { id: 'gpl-3.0', label: 'GPL 3.0', description: 'Copyleft, requires sharing changes.' },
  { id: 'bsd-3', label: 'BSD 3-Clause', description: 'Permissive, no endorsement.' },
  { id: 'isc', label: 'ISC', description: 'Simplified BSD/MIT equivalent.' },
];
