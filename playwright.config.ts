import { defineConfig } from '@playwright/test';

const PORT = 3100;
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  workers: process.env.CI ? 4 : 6,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'e2e-results/report.json' }],
    ['html', { outputFolder: 'e2e-results/html', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 30_000,
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      process.env.E2E_SKIP_BUILD === '1'
        ? `npm run start -- -p ${PORT}`
        : `npm run build && npm run start -- -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000,
  },
});
