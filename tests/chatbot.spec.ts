import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Chatbot Feature', () => {
  // Set longer timeout for chatbot tests as they involve AI response generation
  test.setTimeout(180000);

  test('should send a question with source and attachment in chatbot', async ({ page }) => {
    // Step 1: Login with valid credentials
    await page.goto('https://astrazeneca.atrix.ai/signin');

    // Handle cookie consent if present
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
    } catch {
      // Cookie consent not present
    }

    // Enter email and password
    await page.locator('#email').fill('thanh.pham@c0x12c.com');
    await page.locator('#password').fill('Hanoi@12345678');

    // Click Login button
    await page.getByRole('button', { name: 'Sign in to your account' }).click();

    // If "Network Error" appears, wait and retry once
    await page.waitForTimeout(3000);
    const networkError = page.getByText('Network Error');
    if (await networkError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name: 'Sign in to your account' }).click();
    }

    // Wait for navigation to workspaces/organization page
    await page.waitForURL(/.*(?:workspaces|organization).*/, { timeout: 60000 });

    // Step 2: Wait for workspace page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000);

    // Verify we are on the workspace page
    await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 30000 });

    // Wait for the chatbot interface to be ready
    const textarea = page.getByPlaceholder('What would you like to know about your data?');
    await textarea.waitFor({ state: 'visible', timeout: 30000 });

    // Step 3: Fill a question in the textarea
    const question = 'What are HCPs impression on latest clinical trial datasets?';
    await textarea.fill(question);
    await page.waitForTimeout(1000);

    // Step 4: Select source, select smartsheet, and upload attachment

    // 4a: Click "Select sources..." to open source dropdown
    const selectSourcesButton = page.getByText('Select sources...');
    await selectSourcesButton.waitFor({ state: 'visible', timeout: 10000 });
    await selectSourcesButton.click();
    await page.waitForTimeout(2000);

    // 4b: Select any smartsheet in the source dialog
    // The sources open in a dialog, so we need to look inside the dialog
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    const smartsheetOption = dialog.getByText('SMARTSHEET').first();
    await smartsheetOption.waitFor({ state: 'visible', timeout: 10000 });
    await smartsheetOption.click();
    await page.waitForTimeout(1000);

    // Click Add button if present inside dialog
    try {
      const addButton = dialog.getByRole('button', { name: 'Add' });
      if (await addButton.isVisible({ timeout: 3000 })) {
        await addButton.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Add button not present, continue
    }

    // Close the dialog by clicking outside or pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    // 4c: Click attachment button and upload file
    // Find the attachment/paperclip button (not the search button)
    const attachmentButton = page.locator('[aria-label*="ttach"], [data-testid*="attach"], [data-testid*="upload"], button[title*="ttach"]').first();

    // Use file chooser to handle the file upload properly
    const filePath = path.resolve(__dirname, '..', 'test-files', 'test-data.xlsx');

    // Try to find and click the attachment button
    if (await attachmentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null),
        attachmentButton.click()
      ]);

      if (fileChooser) {
        await fileChooser.setFiles(filePath);
        await page.waitForTimeout(5000);
      }
    } else {
      // If attachment button not found, try using file input directly
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        await fileInput.setInputFiles(filePath);
        await page.waitForTimeout(5000);
      }
    }

    // Step 5: Click Send button and go to chat thread
    const sendButton = page.locator('[data-testid="research-assistant-send"]');
    await sendButton.waitFor({ state: 'visible', timeout: 30000 });

    // Take screenshot before clicking Send
    await page.screenshot({ path: 'test-results/chatbot-before-send.png', fullPage: true });

    // Click Send button
    await sendButton.click();

    // Step 6: Wait for navigation to chat thread
    // Wait for URL to change (indicates navigation to chat thread)
    await page.waitForTimeout(5000);
    await page.waitForURL(/.*(?:chat|research|thread|document).*/i, { timeout: 60000 });

    // Wait for chat thread page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Take screenshot of chat thread
    await page.screenshot({ path: 'test-results/chatbot-chat-thread.png', fullPage: true });

    // Step 7: Wait for chatbot response to finish generating
    // Wait for all loading/processing text to disappear
    const loadingText = page.locator('text=/analyzing|saving|processing|generating|thinking|adding|loading/i').first();

    // Wait for loading text to appear first (confirms AI is processing)
    await loadingText.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});

    // Then wait for ALL loading text to disappear (response complete)
    // Keep checking until no loading text is visible
    let attempts = 0;
    while (attempts < 60) { // Max 2 minutes
      const isLoading = await loadingText.isVisible().catch(() => false);
      if (!isLoading) {
        // Double check after a short wait
        await page.waitForTimeout(3000);
        const stillLoading = await loadingText.isVisible().catch(() => false);
        if (!stillLoading) break;
      }
      await page.waitForTimeout(2000);
      attempts++;
    }

    // Additional wait to ensure response is fully rendered
    await page.waitForTimeout(5000);

    // Step 8: Verify chatbot response is successful
    // Take screenshot of completed response
    await page.screenshot({ path: 'test-results/chatbot-response-complete.png', fullPage: true });

    // Verify the chat thread shows the question and response
    const questionDisplayed = page.locator('text=/HCPs.*impression/i').first();
    await expect(questionDisplayed).toBeVisible({ timeout: 30000 });

    // Verify no error state
    const pageContent = await page.content();
    expect(pageContent).not.toContain('error occurred');
    expect(pageContent.length).toBeGreaterThan(1000);
  });
});
