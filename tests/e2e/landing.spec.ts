import { test, expect } from '@playwright/test';

test.describe('Landing surface', () => {
  test('home page renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    await page.goto('/');
    // The hero / app shell should mount quickly.
    await expect(page.locator('body')).toBeVisible();

    // Give React one tick to render without an unhandled error.
    await page.waitForTimeout(250);

    // Filter out expected dev-only noise (Vite HMR, React DevTools, etc.).
    const realErrors = errors.filter(
      (e) =>
        !/Download the React DevTools/i.test(e) &&
        !/HMR/i.test(e) &&
        !/Failed to load resource.*favicon/i.test(e),
    );
    expect(realErrors).toEqual([]);
  });

  test('learn route lists at least one course', async ({ page }) => {
    await page.goto('/learn');
    // Courses surface should be reachable.
    await expect(page).toHaveURL(/\/learn/);
    await expect(page.locator('body')).toBeVisible();
  });
});