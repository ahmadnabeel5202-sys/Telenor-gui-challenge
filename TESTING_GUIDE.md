# Telenor GUI Challenge - Testing Guide

## Overview

This document provides comprehensive guidance on running, analyzing, and maintaining the Telenor GUI E2E tests.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate and view Allure report
npm run allure:report
```

## Test Execution Modes

### 1. Headless Mode (Default)
```bash
npm test
```
- Fastest execution
- No browser window
- Used in CI/CD pipelines

### 2. Headed Mode
```bash
npm test -- --headed
```
- Browser window visible
- Useful for debugging
- Watch interactions in real-time

### 3. Debug Mode
```bash
npm run test:debug
```
- Step-by-step execution
- Inspect DOM at each step
- Interactive debugging

### 4. UI Mode
```bash
npm run test:ui
```
- Visual test editor
- Run/pause/resume tests
- Trace viewer integration

## Understanding Test Results

### Playwright HTML Report
```bash
npm run test:report
```
- Test summary
- Individual test details
- Screenshots and videos
- Traces for failed tests

### Allure Report
```bash
npm run allure:report
```
#### Report includes:
- **Overview**: Pass/fail statistics
- **Timeline**: Test execution sequence
- **Categories**: Grouped by failure type
- **Behaviors**: Test classifications
- **Packages**: Test organization

#### Key Sections:
- **Suites**: Test hierarchy
- **Steps**: Detailed test flow
- **Attachments**: Screenshots, videos, logs

## Test Architecture

### File Structure
```
tests/
  └── telenor-bredband.spec.ts    # Test specifications

pages/
  ├── basePage.ts                  # Common page methods
  └── bredband.page.ts             # Bredband page object

utils/
  └── custom-expect.ts             # Custom assertions

api-test.config.ts                 # Test configuration
playwright.config.ts               # Playwright config
```

### Page Object Model (POM)

**Benefits:**
- ✅ Centralized selectors
- ✅ Reusable methods
- ✅ Easy maintenance
- ✅ Reduced test code duplication

**Example:**
```typescript
const breddbandPage = new BreddbandPage(page);
await breddbandPage.navigateToBredband();
await breddbandPage.enterAddress('Kungsgatan 103, Uppsala');
await breddbandPage.verifyProductGridNotEmpty();
```

## Test Cases Explained

### TC-001: Main Feature Test ⭐
**Purpose**: Full user workflow validation
**Flow**:
1. Navigate to Bredband page
2. Dismiss cookie banner
3. Verify page title
4. Enter address (conditional)
5. Submit search
6. Verify products display

**Critical Assertions**:
- Product grid has items
- Products are visible
- Address is correctly entered

### TC-002: Page Title Verification
**Purpose**: Verify correct page is loaded
**Validates**: H1/H2 contains "Bredband"
**Use Case**: Navigation & URL verification

### TC-003: UI Element Presence
**Purpose**: Verify form elements exist
**Validates**: Address input field is present
**Use Case**: Pre-requisite for address entry

### TC-004: Product Visibility
**Purpose**: Ensure products appear after address entry
**Validates**: Product count > 0
**Use Case**: Feature functionality

## Allure Reporting Features

### Test Metrics
```
Total Tests: 4
Passed: 4 (100%)
Failed: 0 (0%)
Duration: ~8 seconds
```

### Test Categorization

**By Status:**
- Passed ✅
- Failed ❌
- Skipped ⏭️

**By Type:**
- Smoke Tests
- Feature Tests
- Regression Tests

**By Severity:**
- Blocker 🔴
- Critical 🟠
- Major 🟡
- Minor 🔵

### Timeline View
- Shows test execution order
- Displays parallel execution
- Identifies bottlenecks

## Troubleshooting

### Issue: Tests Timeout
**Solution 1**: Increase timeout
```typescript
// In playwright.config.ts
timeout: 120000  // 2 minutes
```

**Solution 2**: Run in headed mode to debug
```bash
npm test -- --headed
```

### Issue: Cookie Banner Not Found
**Solution**: Banner is optional, test handles both cases
```typescript
// Code automatically handles:
- Banner present → dismiss it
- Banner absent → continue
```

### Issue: Products Not Found
**Possible Causes**:
1. Address field empty
2. Address invalid
3. No broadband available for address

**Debug**:
1. Take screenshot: `await page.screenshot({ path: 'debug.png' })`
2. Check address value
3. Verify product selector is current

### Issue: Selector Not Matching
**Solution**: Update selectors using Inspector
```bash
npx playwright codegen https://www.telenor.se/handla/bredband/
```

Then update in `bredband.page.ts`:
```typescript
private readonly productGridItems = 'new-selector-here';
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/e2e-tests.yml
- Runs on push/PR to main & develop
- Installs dependencies
- Runs Playwright tests
- Generates Allure report
- Uploads artifacts
```

### Artifacts Generated
1. **allure-report/** - Complete HTML report
2. **playwright-report/** - Playwright HTML report
3. **allure-results/** - Raw Allure data

### View Reports Locally
```bash
# Download from GitHub Actions artifacts
unzip allure-report.zip
open index.html
```

## Performance Optimization

### Parallel Execution
Default: Parallel execution enabled
```typescript
fullyParallel: true  // In playwright.config.ts
```

### Test Duration
Current average: ~8 seconds for 4 tests
- Single test: ~2 seconds
- With artifacts: +3 seconds

### Optimization Tips
1. Use `waitForLoadState('domcontentloaded')` instead of `networkidle`
2. Minimize `waitForTimeout()` duration
3. Use specific selectors for faster element lookup

## Maintenance Guidelines

### Updating Selectors
When page HTML changes:
```bash
1. Run codegen: npx playwright codegen https://telenor.se/handla/bredband/
2. Identify new selectors
3. Update bredband.page.ts
4. Re-run tests
```

### Adding New Tests
```typescript
test('TC-005: New Feature', async () => {
  // Use existing page object
  const breddbandPage = new BreddbandPage(page);
  
  // Follow same pattern
  await test.step('Step 1', async () => {
    // Test implementation
  });
});
```

### Updating Configuration
Edit `api-test.config.ts`:
```typescript
const config = {
  baseUrl: 'https://www.telenor.se',
  guiTests: {
    bredband: '/handla/bredband/',
    address: 'Kungsgatan 103, Uppsala',
  },
};
```

## Best Practices

✅ **DO:**
- Use Page Object Model
- Add descriptive test names
- Use test.step() for clarity
- Capture screenshots on failure
- Keep assertions specific
- Use real-time assertions

❌ **DON'T:**
- Hard-code selectors in tests
- Use generic test names
- Ignore timeout warnings
- Skip error handling
- Rely on timing with `waitForTimeout()`

## Resources

- [Playwright Docs](https://playwright.dev)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## Support & Questions

For issues or questions:
1. Check this guide
2. Review Playwright documentation
3. Check Allure report for details
4. Run in debug mode for investigation

---

**Last Updated**: October 29, 2026
**Version**: 1.0
