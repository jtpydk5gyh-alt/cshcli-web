const { test, expect } = require('@playwright/test');

test('the landing page loads local assets and fits the viewport', async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure().errorText}`));
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(failures).toEqual([]);
});

test('installation navigation, platform selection and copying work', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => { window.copiedCommand = value; } } });
  });
  await page.goto('./');
  const installLink = page.locator('nav a[href="#instalar"]');
  await expect(installLink).toBeVisible();
  await installLink.click();
  await expect(page).toHaveURL(/#instalar$/);
  for (const [platform, interpreter] of [['windows', 'py'], ['macos', 'python3'], ['linux', 'python3']]) {
    await page.locator(`[data-platform="${platform}"]`).click();
    await expect(page.locator(`[data-platform="${platform}"]`)).toHaveAttribute('aria-pressed', 'true');
    const command = await page.locator('#install-command').innerText();
    expect(command).toContain(`${interpreter} -m pip install`);
    expect(command).toContain('https://github.com/jtpydk5gyh-alt/cshcli/');
    await page.locator('#copy-install').click();
    expect(await page.evaluate(() => window.copiedCommand)).toBe(command);
    await expect(page.locator('#copy-status')).toBeVisible();
  }
  await page.locator('.install-panel details').filter({ has: page.locator('#venv-command') }).locator('summary').click();
  await expect(page.locator('#venv-command')).toContainText('.venv/bin/cshcli --version');
});

test('copy failure leaves a selectable command', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Clipboard unavailable'); } } });
  });
  await page.goto('./#instalar');
  await page.locator('#copy-install').click();
  expect(await page.evaluate(() => getSelection().toString())).toBe(await page.locator('#install-command').innerText());
  await expect(page.locator('#copy-status')).toContainText(/Ctrl\+C/);
});

test('English navigation and interactive messages remain in English', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } });
  });
  await page.goto('en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('nav a[href="guide.html"]')).toBeVisible();
  await page.locator('[data-platform="linux"]').click();
  await expect(page.locator('#install-note')).toContainText('Requires Python');
  await page.locator('#copy-install').click();
  await expect(page.locator('#copy-status')).toContainText('copied');
  await expect(page.locator('#motion-toggle')).toContainText('animations');
  await page.locator('nav a[href="guide.html"]').click();
  await expect(page).toHaveURL(/en\/guide\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('motion starts paused and demo changes do not move the page', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/motion-paused/);
  await page.locator('[data-scene="1"]').click();
  const before = await page.evaluate(() => ({ scroll: scrollY, height: document.querySelector('#demo-output').getBoundingClientRect().height }));
  await page.locator('[data-scene="2"]').click();
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ scroll: scrollY, height: document.querySelector('#demo-output').getBoundingClientRect().height }));
  expect(after).toEqual(before);
  await expect(page.locator('[data-scene="2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#motion-toggle').click();
  await expect(page.locator('html')).not.toHaveClass(/motion-paused/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveClass(/motion-paused/);
});

test('the walkthrough plays only after the visitor requests it', async ({ page }) => {
  await page.goto('guide.html');
  const video = page.locator('video');
  expect(await video.evaluate(element => ({ paused: element.paused, autoplay: element.autoplay, controls: element.controls }))).toEqual({ paused: true, autoplay: false, controls: true });
  await page.locator('.video-guide summary').click();
  await video.evaluate(element => element.play());
  await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate(element => element.duration)).toBeGreaterThan(10);
  await video.evaluate(element => element.pause());
});

test('the first-project guide, legal page and 404 are reachable', async ({ page }) => {
  await page.goto('./');
  const guideLink = page.locator('nav a[href="guide.html"]');
  await expect(guideLink).toBeVisible();
  await guideLink.click();
  await expect(page).toHaveURL(/guide\.html$/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toContainText('auth register');
  await expect(page.locator('main')).toContainText('CSHCLI_TOKEN');
  for (const path of ['guide.html', 'legal.html', '404.html', 'en/', 'en/guide.html']) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const response = await page.goto('__browser-check__/missing-page');
  expect(response.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toContainText('perdido');
  await expect(page.locator('a[href="/cshcli-web/guide.html"]')).toBeVisible();
  expect(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily)).not.toBe('"Times New Roman"');
  await page.locator('a[href="/cshcli-web/guide.html"]').click();
  await expect(page).toHaveURL(/guide\.html$/);
});
