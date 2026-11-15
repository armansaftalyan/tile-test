import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3107',
    launchOptions: {
      executablePath: process.env.CHROME_PATH,
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: 'npm run dev -- --port 3107',
    url: 'http://127.0.0.1:3107',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1376, height: 900 } } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
});
