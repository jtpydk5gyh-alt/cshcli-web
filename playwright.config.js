const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4186/cshcli-web/',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } }
  ],
  webServer: {
    command: `${process.platform === 'win32' ? 'python' : 'python3'} scripts/serve.py`,
    url: 'http://127.0.0.1:4186/cshcli-web/',
    reuseExistingServer: !process.env.CI
  }
});
