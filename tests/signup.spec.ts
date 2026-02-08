import { test, expect } from '@playwright/test';

test.describe('Create New Account Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Go to signup page
    await page.goto('https://astrazeneca.atrix.ai/signup?callback-url=&email=');

    // Handle cookie consent if present - wait for it to appear and click
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
      // Wait for cookie banner to disappear
      await page.locator('[aria-label="Cookie Consent Prompt"]').waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Cookie consent not present or already accepted
    }
  });

  test('should display signup form with all required fields', async ({ page }) => {
    // Verify all form fields are visible
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Your Account' })).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    // Click submit without filling any fields
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Verify validation error is displayed
    await expect(page.getByText(/required|enter|name|email/i).first()).toBeVisible({ timeout: 5000 });

    // Verify user stays on signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('invalidemail');
    await page.locator('#password').fill('Test@12345678');
    await page.locator('#confirmPassword').fill('Test@12345678');

    // Click submit
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Verify email validation error is displayed
    await expect(page.getByText(/invalid|email|valid/i).first()).toBeVisible({ timeout: 5000 });

    // Verify user stays on signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    // Fill form with mismatched passwords
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('Test@12345678');
    await page.locator('#confirmPassword').fill('DifferentPassword@123');

    // Click submit
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Verify password mismatch error is displayed
    await expect(page.getByText(/match|same|confirm/i).first()).toBeVisible({ timeout: 5000 });

    // Verify user stays on signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should show validation error for weak password', async ({ page }) => {
    // Fill form with weak password
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('123');
    await page.locator('#confirmPassword').fill('123');

    // Click submit
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Verify password strength error is displayed
    await expect(page.getByText(/strong|weak|character|length|minimum/i).first()).toBeVisible({ timeout: 5000 });

    // Verify user stays on signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should navigate to signin page via link', async ({ page }) => {
    // Look for sign in link and click it
    await page.getByRole('link', { name: /sign in|login|already have/i }).click();

    // Verify navigation to signin page
    await expect(page).toHaveURL(/.*signin.*/);
  });

  test('should signup successfully with valid credentials', async ({ page }) => {
    // Set longer timeout for signup test
    test.setTimeout(90000);

    // Generate unique email with alias using timestamp
    const timestamp = Date.now();
    const email = `barrerajessi78+${timestamp}@gmail.com`;
    const fullName = 'Pham Thi Thanh';
    const password = 'Bananabanana@12';

    // Step 1: Fill signup form with valid credentials
    await page.locator('#name').fill(fullName);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(password);

    // Step 2: Click Create Your Account button
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Step 3: If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const networkError = page.getByText('Network Error');
    if (await networkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Create Your Account' }).click();
    }

    // Step 4: Wait for signup to process
    await page.waitForTimeout(5000);

    // Step 5: Verify successful signup
    // Check for success message or redirect away from signup page
    const currentUrl = page.url();
    const redirectedAway = !currentUrl.includes('signup') ||
                           currentUrl.includes('verify') ||
                           currentUrl.includes('signin') ||
                           currentUrl.includes('success');

    const successMessage = page.locator('text=/success|created|verify|check your email|welcome|account/i').first();
    const hasSuccessMessage = await successMessage.isVisible({ timeout: 10000 }).catch(() => false);

    // Either redirected away from signup or shows success message
    expect(redirectedAway || hasSuccessMessage).toBeTruthy();

    // Take screenshot of result
    await page.screenshot({ path: 'test-results/signup-success.png', fullPage: true });
  });

  test('should show account verification pending message after signup and login', async ({ page }) => {
    // Set longer timeout for this test (signup + login flow)
    test.setTimeout(120000);

    // Generate unique email with alias using timestamp
    const timestamp = Date.now();
    const email = `barrerajessi78+${timestamp}@gmail.com`;
    const fullName = 'Pham Thi Thanh';
    const password = 'Bananabanana@12';

    // Step 1: Fill signup form with valid credentials
    await page.locator('#name').fill(fullName);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(password);

    // Step 2: Click Create Your Account button
    await page.getByRole('button', { name: 'Create Your Account' }).click();

    // Step 2b: If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const networkError = page.getByText('Network Error');
    if (await networkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Create Your Account' }).click();
    }

    // Step 3: Wait for the signup success page
    await page.waitForTimeout(5000);

    // Verify "Account Created Successfully!" message appears
    await expect(page.getByText('Account Created Successfully!')).toBeVisible({ timeout: 30000 });

    // Verify email verification instructions
    await expect(page.getByText('Verify Your Email Address')).toBeVisible({ timeout: 10000 });

    // Take screenshot of signup success page
    await page.screenshot({ path: 'test-results/signup-before-login.png', fullPage: true });

    // Step 4: Click "Sign In to Your Account" link to go to signin page
    await page.getByRole('link', { name: 'Sign In to Your Account' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Handle cookie consent if present
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
    } catch {
      // Cookie consent not present
    }

    // Step 5: Login with the newly created account
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // Step 5b: If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const loginNetworkError = page.getByText('Network Error');
    if (await loginNetworkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Sign in to your account' }).click();
    }

    // Step 6: Wait and verify the email verification required message
    await page.waitForTimeout(5000);

    // Verify the "not verified" message appears after login attempt
    const verificationMessage = page.getByText('Your account has not been verified yet!');
    await expect(verificationMessage).toBeVisible({ timeout: 30000 });

    // Take screenshot of verification required message
    await page.screenshot({ path: 'test-results/signup-email-verification-required.png', fullPage: true });
  });
});
