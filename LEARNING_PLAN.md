# Playwright Automation Learning Plan

## For: QA Manual Tester (No Coding Background)

---

## Phase 1: Foundation (Week 1-2)

### Goals
- Understand basic test structure
- Run existing tests
- Use Playwright codegen

### Day 1-2: Setup & First Run
| Task | Command | Status |
|------|---------|--------|
| Install Node.js | Download from nodejs.org | [ ] |
| Install Playwright | `npm init playwright@latest` | [ ] |
| Run example test | `npx playwright test` | [ ] |
| View test report | `npx playwright show-report` | [ ] |

### Day 3-4: Understand Test Structure
```typescript
// Learn this basic structure:
import { test, expect } from '@playwright/test';

test('test name here', async ({ page }) => {
  // Step 1: Go to page
  await page.goto('https://example.com');

  // Step 2: Do action
  await page.locator('#button').click();

  // Step 3: Verify result
  await expect(page).toHaveURL(/.*success.*/);
});
```

### Day 5-7: Use Codegen (Record Tests)
```bash
# This opens a browser and records your actions as code!
npx playwright codegen https://astrazeneca.atrix.ai/signin
```

**Practice:**
- [ ] Record a login test
- [ ] Record a signup test
- [ ] Copy generated code to a test file
- [ ] Run the recorded test

---

## Phase 2: Core Skills (Week 3-4)

### Goals
- Master locators
- Learn common actions
- Write assertions

### Locators to Master (Priority Order)

| # | Locator Type | Example | When to Use |
|---|--------------|---------|-------------|
| 1 | data-testid | `page.locator('[data-testid="login"]')` | Best - always use if available |
| 2 | ID | `page.locator('#email')` | Good - unique elements |
| 3 | Role | `page.getByRole('button', { name: 'Send' })` | Buttons, links |
| 4 | Placeholder | `page.getByPlaceholder('Enter email')` | Input fields |
| 5 | Text | `page.getByText('Welcome')` | Last resort |

### Common Actions

| Action | Code | Example |
|--------|------|---------|
| Go to URL | `page.goto(url)` | `await page.goto('https://example.com')` |
| Click | `.click()` | `await page.locator('#btn').click()` |
| Type/Fill | `.fill(text)` | `await page.locator('#email').fill('test@email.com')` |
| Press key | `.press(key)` | `await page.keyboard.press('Enter')` |
| Wait | `waitForTimeout(ms)` | `await page.waitForTimeout(3000)` |
| Screenshot | `screenshot()` | `await page.screenshot({ path: 'test.png' })` |

### Assertions (Verify Results)

| Assertion | Code | When to Use |
|-----------|------|-------------|
| Element visible | `await expect(locator).toBeVisible()` | Check element shows |
| URL changed | `await expect(page).toHaveURL(/pattern/)` | After navigation |
| Text appears | `await expect(locator).toHaveText('text')` | Verify text content |
| Element enabled | `await expect(locator).toBeEnabled()` | Check button clickable |

### Practice Exercises
- [ ] Write login test without codegen
- [ ] Write signup test without codegen
- [ ] Add assertions to verify success/failure
- [ ] Handle cookie consent popup

---

## Phase 3: Real Tests (Week 5-6)

### Goals
- Write complete test scenarios
- Handle waits properly
- Debug failing tests

### Test Pattern Template
```typescript
test.describe('Feature Name', () => {

  test.beforeEach(async ({ page }) => {
    // Setup: runs before each test
    await page.goto('https://your-app.com');
  });

  test('should do something successfully', async ({ page }) => {
    // Step 1: Action
    await page.locator('#input').fill('value');

    // Step 2: Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Step 3: Verify
    await expect(page.getByText('Success')).toBeVisible();
  });

  test('should show error for invalid input', async ({ page }) => {
    // Negative test case
    await page.locator('#input').fill('invalid');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Error')).toBeVisible();
  });
});
```

### Wait Strategies (Important!)
```typescript
// GOOD: Wait for specific element
await page.locator('#result').waitFor({ state: 'visible', timeout: 30000 });

// GOOD: Wait for URL change
await page.waitForURL(/.*dashboard.*/, { timeout: 60000 });

// OK: Fixed wait (use only when necessary)
await page.waitForTimeout(3000);

// BAD: No wait at all (test will fail randomly)
```

### Practice: Write These Tests
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Signup new account
- [ ] Logout after login
- [ ] Form validation errors

---

## Phase 4: Advanced (Week 7-8)

### Goals
- Handle complex scenarios
- File uploads
- API responses

### File Upload Pattern
```typescript
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.locator('[data-testid="upload"]').click()
]);
await fileChooser.setFiles('/path/to/file.xlsx');
```

### Handle Dynamic Content
```typescript
// Wait for loading to finish
await page.locator('.loading').waitFor({ state: 'hidden' });

// Wait for text to appear
await page.waitForSelector('text=Data loaded');
```

### Debug Failing Tests
```bash
# Run with visible browser
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with trace
npx playwright test --trace on
```

### Practice: Complex Tests
- [ ] Test with file upload
- [ ] Test with multiple steps
- [ ] Test that waits for API response
- [ ] Test with dynamic content

---

## Quick Reference Card

### Run Commands
```bash
npx playwright test                    # Run all tests
npx playwright test login.spec.ts     # Run one file
npx playwright test -g "login"        # Run by name
npx playwright test --headed          # See browser
npx playwright test --debug           # Debug mode
npx playwright codegen URL            # Record test
```

### Test File Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should work', async ({ page }) => {
    await page.goto('url');
    await page.locator('#id').click();
    await expect(page).toHaveURL(/expected/);
  });
});
```

---

## Progress Tracker

| Week | Phase | Status |
|------|-------|--------|
| 1-2 | Foundation | [ ] |
| 3-4 | Core Skills | [ ] |
| 5-6 | Real Tests | [ ] |
| 7-8 | Advanced | [ ] |

---

## Resources

- **Playwright Docs**: https://playwright.dev/docs/intro
- **Locators Guide**: https://playwright.dev/docs/locators
- **Assertions Guide**: https://playwright.dev/docs/test-assertions
- **Codegen Tool**: `npx playwright codegen`

---

*Remember: You already know HOW to test. Now you're just learning a new tool to automate what you already do manually!*
