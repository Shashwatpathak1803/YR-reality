import { test, expect } from '@playwright/test';

test.describe('Test 4 — Enquiry & Site Visit Forms (Validation & Mocked Submission)', () => {
  test.beforeEach(async ({ page }) => {
    // Stub window.open and dismiss automatic site visit popup during tests
    await page.addInitScript(() => {
      window.open = () => null;
      window.localStorage.setItem('siteVisitBooked', '1');
    });
  });

  test('should submit Site Visit form successfully without validation mismatch error', async ({ page }) => {
    let capturedPayload: any = null;

    // Intercept site-visits API
    await page.route(/.*\/api\/site-visits.*/, async (route) => {
      const req = route.request();
      if (req.method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'access-control-allow-headers': '*',
          },
        });
      } else if (req.method() === 'POST') {
        capturedPayload = req.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          headers: {
            'access-control-allow-origin': '*',
          },
          body: JSON.stringify({
            success: true,
            statusCode: 201,
            message: 'Site visit scheduled successfully',
            data: {
              _id: 'mock-visit-id-123',
              name: capturedPayload?.name,
              phone: capturedPayload?.phone,
              preferredDate: capturedPayload?.preferredDate,
              location: capturedPayload?.location,
              notes: capturedPayload?.notes,
              status: 'Pending',
              createdAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const visitSection = page.locator('#visit');
    await visitSection.scrollIntoViewIfNeeded();

    const visitForm = visitSection.locator('form');
    await expect(visitForm).toBeVisible({ timeout: 10000 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 10);

    // Fill form fields
    const nameInput = visitForm.locator('input[placeholder="Full name"]');
    await nameInput.click();
    await nameInput.fill('Test Visitor');

    const phoneInput = visitForm.locator('input[placeholder="10-digit mobile number"]');
    await phoneInput.click();
    await phoneInput.fill('9876543210');

    const locInput = visitForm.locator('input[placeholder*="Gurugram"]');
    await locInput.click();
    await locInput.fill('Gurugram Sector 65');

    const dateInput = visitForm.locator('input[type="date"]');
    await dateInput.fill(formattedDate);

    // Click Book Site Visit button
    const bookBtn = visitForm.getByRole('button', { name: /Book Site Visit/i });
    await bookBtn.click();

    // Verify UI confirmation shows success
    await expect(visitSection.getByRole('heading', { name: 'Visit Scheduled!' })).toBeVisible({ timeout: 10000 });
    await expect(visitSection.getByText(/Thank you Test/i)).toBeVisible();
  });

  test('should trigger client validation when phone number is invalid', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const visitSection = page.locator('#visit');
    await visitSection.scrollIntoViewIfNeeded();

    const visitForm = visitSection.locator('form');
    await expect(visitForm).toBeVisible({ timeout: 10000 });

    // Fill invalid phone (only 5 digits)
    const nameInput = visitForm.locator('input[placeholder="Full name"]');
    await nameInput.click();
    await nameInput.fill('Valid Name');

    const phoneInput = visitForm.locator('input[placeholder="10-digit mobile number"]');
    await phoneInput.click();
    await phoneInput.fill('12345');

    const bookBtn = visitForm.getByRole('button', { name: /Book Site Visit/i });
    await bookBtn.click();

    // Verify client validation error message is displayed
    await expect(visitForm.getByText(/Please enter a valid 10-digit mobile number/i)).toBeVisible();
  });

  test('should submit Contact / Enquiry form successfully', async ({ page }) => {
    let enquiryPayload: any = null;

    // Intercept enquiries API
    await page.route(/.*\/api\/enquiries.*/, async (route) => {
      const req = route.request();
      if (req.method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'access-control-allow-headers': '*',
          },
        });
      } else if (req.method() === 'POST') {
        enquiryPayload = req.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          headers: {
            'access-control-allow-origin': '*',
          },
          body: JSON.stringify({
            success: true,
            statusCode: 201,
            message: 'Enquiry submitted successfully',
            data: { _id: 'mock-enquiry-id-456', ...enquiryPayload },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    const contactForm = contactSection.locator('form');
    await expect(contactForm).toBeVisible({ timeout: 10000 });

    const nameInput = contactForm.locator('input[placeholder="Your name"]');
    await nameInput.click();
    await nameInput.fill('Aman Sharma');

    const phoneInput = contactForm.locator('input[placeholder="10-digit mobile number"]');
    await phoneInput.click();
    await phoneInput.fill('9988776655');

    const emailInput = contactForm.locator('input[placeholder="you@example.com"]');
    await emailInput.click();
    await emailInput.fill('aman@example.com');

    const msgInput = contactForm.locator('textarea');
    await msgInput.click();
    await msgInput.fill('Looking for luxury plot options in Noida.');

    const sendBtn = contactForm.getByRole('button', { name: /Send Message/i });
    await sendBtn.click();

    // Verify UI confirmation
    await expect(contactSection.getByText('Message Sent!')).toBeVisible({ timeout: 10000 });
    expect(enquiryPayload).not.toBeNull();
    expect(enquiryPayload.name).toBe('Aman Sharma');
    expect(enquiryPayload.phone).toBe('9988776655');
  });
});
