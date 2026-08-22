import { test, expect } from '@playwright/test';

test.describe('Test 1 — Homepage Flows', () => {
  test('should load the YR Realty homepage successfully and verify branding & hero section', async ({ page }) => {
    // 1. Open the website
    await page.goto('/');

    // 2. Verify page title
    await expect(page).toHaveTitle(/YR Realty/i);

    // 3. Verify Header and brand logo / title
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('heading', { level: 1 })).toContainText(/YR Reality/i);

    // 4. Verify Hero section and search elements
    const heroSection = page.locator('#home');
    await expect(heroSection).toBeVisible();
    await expect(heroSection.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(heroSection.getByRole('button', { name: /search/i })).toBeVisible();

    // 5. Verify direct contact links (Call / WhatsApp)
    const callButton = page.locator('a[href^="tel:"]').first();
    await expect(callButton).toBeVisible();
  });
});
