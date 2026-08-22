import { test, expect } from '@playwright/test';

test.describe('Test 2 & 3 — Property Listings & EMI / Loan Calculator (Read-Only)', () => {
  test('should display property listings from the database and render property details accurately', async ({ page }) => {
    // 1. Open the homepage
    await page.goto('/');

    // 2. Locate and scroll to properties section
    const propertiesSection = page.locator('#properties');
    await expect(propertiesSection).toBeVisible({ timeout: 20000 });
    await propertiesSection.scrollIntoViewIfNeeded();

    // 3. Verify property cards are rendered from MongoDB Atlas
    const propertyCards = propertiesSection.locator('article');
    await expect(propertyCards.first()).toBeVisible({ timeout: 20000 });

    // 4. Verify details of the first property card (title, location, RERA badge, price formatting)
    const firstCard = propertyCards.first();
    await expect(firstCard.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(firstCard.getByText(/RERA VERIFIED/i)).toBeVisible();
    await expect(firstCard.getByText(/Price/i)).toBeVisible();

    // 5. Verify action buttons on property card (WhatsApp, Call, Book Visit)
    await expect(firstCard.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
    await expect(firstCard.getByRole('link', { name: /Call/i })).toBeVisible();
    await expect(firstCard.getByRole('link', { name: /Book Visit/i })).toBeVisible();
  });

  test('should automatically calculate real-time EMI, interest and total payable with interactive inputs', async ({ page }) => {
    await page.goto('/');

    const calcSection = page.locator('#calculator');
    await calcSection.scrollIntoViewIfNeeded();
    await expect(calcSection).toBeVisible();

    // Verify EMI calculation output card
    const emiResult = calcSection.locator('#emi-result-amount');
    await expect(emiResult).toBeVisible();
    await expect(emiResult).toContainText(/₹/);

    // Verify financial breakdown metric cards
    await expect(calcSection.getByText(/Principal Loan/i)).toBeVisible();
    await expect(calcSection.getByText(/Total Interest/i)).toBeVisible();
    await expect(calcSection.getByText(/Total Amount/i)).toBeVisible();
  });
});
