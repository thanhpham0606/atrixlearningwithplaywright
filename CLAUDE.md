# Playwright Test Automation Guide

## Context
- I am a **QA Manual Tester** learning automation
- I do **NOT** know how to code
- I need simple, readable TypeScript code
- Prefer explicit steps over clever code
- Avoid advanced patterns unless necessary

## Project Info
- **Framework**: Playwright
- **Language**: TypeScript
- **Application**: https://astrazeneca.atrix.ai

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Valid User | thanh.pham@c0x12c.com | Hanoi@12345678 |
| Signup Test | barrerajessi78+{timestamp}@gmail.com | Bananabanana@12 |

## Rules for Writing Tests

### Test Structure
- Always explain what each step does with comments
- Use clear, descriptive test names
- One test = one business scenario
- Group related tests with `test.describe()`

### Naming Convention
```typescript
// Good test names:
'should login successfully with valid credentials'
'should show error message with invalid password'
'should navigate to signup page via link'

// Bad test names:
'test1'
'login test'
'check stuff'
```

### Code Style
```typescript
// Always use this pattern:
test('should [action] [expected result]', async ({ page }) => {
  // Step 1: Description of action
  await page.goto('url');

  // Step 2: Description of action
  await page.locator('#element').fill('value');

  // Step 3: Description of action
  await page.getByRole('button', { name: 'Submit' }).click();

  // Step 4: Verify result
  await expect(page).toHaveURL(/.*expected.*/);
});
```

### Locator Priority (Use in this order)
1. `data-testid` - Best choice: `page.locator('[data-testid="login-btn"]')`
2. `id` - Good choice: `page.locator('#email')`
3. `role` - For buttons/links: `page.getByRole('button', { name: 'Send' })`
4. `placeholder` - For inputs: `page.getByPlaceholder('Enter email')`
5. `text` - Last resort: `page.getByText('Welcome')`

### Wait Strategies
```typescript
// Preferred: Wait for specific element
await page.locator('#element').waitFor({ state: 'visible', timeout: 30000 });

// For navigation
await page.waitForURL(/.*expected.*/, { timeout: 60000 });

// Fixed wait (use sparingly)
await page.waitForTimeout(3000);
```

## Common Patterns

### Login Flow
```typescript
await page.goto('https://astrazeneca.atrix.ai/signin');
await page.locator('#email').fill('email@example.com');
await page.locator('#password').fill('password');
await page.getByRole('button', { name: 'Sign in to your account' }).click();
await page.waitForURL(/.*workspaces.*/, { timeout: 60000 });
```

### Handle Cookie Consent
```typescript
try {
  const acceptButton = page.getByRole('button', { name: 'Accept' });
  await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
  await acceptButton.click();
} catch {
  // Cookie consent not present
}
```

### File Upload
```typescript
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser', { timeout: 10000 }),
  page.locator('[data-testid="upload-btn"]').click()
]);
await fileChooser.setFiles('/path/to/file.xlsx');
```

### Take Screenshot
```typescript
await page.screenshot({ path: 'test-results/screenshot-name.png', fullPage: true });
```

## Test Files Structure
```
tests/
├── login.spec.ts      # Login feature tests
├── signup.spec.ts     # Signup feature tests
├── chatbot.spec.ts    # Chatbot feature tests
└── example.spec.ts    # Example/sample tests
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should login successfully"
```

### Run with visible browser
```bash
npx playwright test --headed
```

### Generate code by recording
```bash
npx playwright codegen https://astrazeneca.atrix.ai/signin
```

## Do NOT
- Do not use complex TypeScript features (generics, decorators, etc.)
- Do not create helper functions unless I ask
- Do not refactor working code unless I ask
- Do not add extra error handling unless necessary
- Do not use Page Object Model unless I ask
