import { test, expect } from '@playwright/test';

test.describe('Login Feature', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Set longer timeout for login test
    test.setTimeout(90000);

    // Step 1: Go to login page
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
      await page.locator('[aria-label="Cookie Consent Prompt"]').waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Cookie consent not present or already accepted
    }

    // Step 2: Input valid email and password
    await page.locator('#email').fill('thanh.pham@c0x12c.com');
    await page.locator('#password').fill('Hanoi@12345678');

    // Step 3: Click Login button
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // Step 4: If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const networkError = page.getByText('Network Error');
    if (await networkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Sign in to your account' }).click();
    }

    // Step 5: Wait for navigation to workspaces/organization page
    await page.waitForURL(/.*(?:workspaces|organization).*/, { timeout: 60000 });

    // Verify successful login - should be on workspaces/organization page
    await expect(page).toHaveURL(/.*(?:workspaces|organization).*/);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Step 1: Go to login page
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
    }

    // Step 2: Input invalid email and password
    await page.locator('#email').fill('invalid@test.com');
    await page.locator('#password').fill('wrongpassword');

    // Step 3: Click Login button
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // Step 4: Verify error message is displayed
    await expect(page.getByText(/invalid|error|incorrect|failed/i)).toBeVisible({ timeout: 10000 });

    // Verify user stays on signin page
    await expect(page).toHaveURL(/.*signin.*/);
  });

  test('should show validation error for empty email and password', async ({ page }) => {
    // Step 1: Go to login page
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
    }

    // Step 2: Leave email and password empty and click Login
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // Step 3: Verify validation error is displayed
    await expect(page.getByText(/required|enter|email|invalid/i).first()).toBeVisible({ timeout: 5000 });

    // Verify user stays on signin page
    await expect(page).toHaveURL(/.*signin.*/);
  });

  test('should navigate to signup page via Create one now link', async ({ page }) => {
    // Step 1: Go to login page
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
    }

    // Step 2: Click on "Create one now" link
    await page.getByRole('link', { name: 'Create one now' }).click();

    // Step 3: Verify redirect to signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should logout successfully after login', async ({ page }) => {
    // Set longer timeout for logout test (login + logout)
    test.setTimeout(120000);

    // Step 1: Go to login page
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
      await page.locator('[aria-label="Cookie Consent Prompt"]').waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Cookie consent not present
    }

    // Step 2: Login with valid credentials
    await page.locator('#email').fill('thanh.pham@c0x12c.com');
    await page.locator('#password').fill('Hanoi@12345678');

    // Step 3: Click Login button
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // Step 3b: If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const networkError = page.getByText('Network Error');
    if (await networkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Sign in to your account' }).click();
    }

    // Wait for navigation to workspaces/organization page
    await page.waitForURL(/.*(?:workspaces|organization).*/, { timeout: 60000 });

    // Handle cookie consent again if it appears after login
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 3000 });
      await acceptButton.click();
      await page.waitForTimeout(1000);
    } catch {
      // Cookie consent not present
    }

    // Step 4: Click on Avatar/Profile to open menu
    await page.waitForTimeout(2000);
    const avatar = page.locator('[class*="Avatar"], [class*="avatar"], [data-testid*="avatar"], [class*="profile"]').first();
    await avatar.waitFor({ state: 'visible', timeout: 10000 });
    await avatar.click();
    await page.waitForTimeout(2000);

    // Step 5: Click Logout and wait for redirect
    const logoutButton = page.getByText('Logout', { exact: false });
    await logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await Promise.all([
      page.waitForURL(/.*signin.*/, { timeout: 60000 }),
      logoutButton.click()
    ]);

    // Step 6: Verify redirect to signin page
    await expect(page).toHaveURL(/.*signin.*/, { timeout: 10000 });
  });
});
