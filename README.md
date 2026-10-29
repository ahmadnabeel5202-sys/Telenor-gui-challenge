# Telenor E2E GUI Testing Challenge

Automated UI browser testing for Telenor's broadband product search using **Playwright** with **TypeScript** and **Page Object Model (POM)** architecture.

## Challenge Overview

Navigate to telenor.se and automate the following user flow:
1. Open Telenor website
2. Navigate to "Handla" (Shop) → "Bredband" (Broadband)
3. Enter address: `Kungsgatan 103, Uppsala`
4. Verify featured product grid displays at least one product

## Project Structure

```
telenor-api-challenge/
├── tests/
│   └── telenor-bredband.spec.ts          # Test specifications
├── pages/
│   ├── basePage.ts                        # Base page class with common methods
│   └── bredband.page.ts                   # Bredband page object model
├── utils/
│   └── custom-expect.ts                   # Custom assertions
├── api-test.config.ts                     # Configuration file
├── playwright.config.ts                   # Playwright configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json                           # Dependencies & scripts
└── README.md                              # This file
```

## Installation

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI (interactive mode)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View HTML report
```bash
npm run test:report
```

## Allure Reporting

Allure provides comprehensive test execution reports with detailed analytics.

### Generate Allure Report
```bash
npm run allure:generate
```

### Generate and Open Allure Report
```bash
npm run allure:report
```

### Clean Allure Results
```bash
npm run allure:clean
```

### Allure Report Contents

The Allure report includes:
- ✅ Test execution overview
- 📊 Pass/Fail statistics
- ⏱️ Test duration metrics
- 📸 Screenshots of failures
- 🎥 Video recordings
- 📝 Step-by-step test flow
- 🏷️ Test categories & tags

## Page Object Model (POM)

### BasePage
Common functionality shared across all pages:
- Navigation
- Cookie banner dismissal
- Page load waits
- Utility methods

### BreddbandPage
Bredband-specific page object with:
- Selectors for all page elements
- Methods for user interactions
- Assertions for page state

**Example Usage:**
```typescript
await breddbandPage.navigateToBredband();
await breddbandPage.dismissCookieBanner();
await breddbandPage.enterAddress('Kungsgatan 103, Uppsala');
await breddbandPage.verifyProductGridNotEmpty();
```

## Test Cases

### TC-001: Navigate to Bredband and verify featured products
- **Status**: ✅ Passing
- **Steps**: 
  1. Navigate to Bredband page
  2. Dismiss cookie banner
  3. Verify page title
  4. Enter address (if needed)
  5. Verify product grid has items
  6. Verify products are visible

### TC-002: Verify Bredband page heading
- **Status**: ✅ Passing
- **Validates**: Page title contains "Bredband"

### TC-003: Verify address input field is present
- **Status**: ✅ Passing
- **Validates**: Address input field exists and is visible

### TC-004: Verify product count and visibility
- **Status**: ⚠️ Requires address entry
- **Note**: This test validates products appear only after address is entered

## Configuration

### Environment Setup
Edit `api-test.config.ts` to configure:
- Base URL (default: https://www.telenor.se)
- Test address (default: Kungsgatan 103, Uppsala)
- Environment-specific settings

### Playwright Config
`playwright.config.ts` settings:
- Browser: Chromium
- Test timeout: 60 seconds
- Screenshot on failure: Enabled
- Video on failure: Enabled
- Trace: On first retry

## Test Execution Flow

```
1. beforeEach() → Initialize page object
   ↓
2. Test Step 1 → Navigate & Dismiss Cookie
   ↓
3. Test Step 2 → Fill Address (if empty)
   ↓
4. Test Step 3 → Submit & Verify
   ↓
5. afterEach() → Cleanup
```

## Key Selectors

| Element | Selector |
|---------|----------|
| Page Heading | `h1, h2` |
| Address Input | `input[type="text"]` |
| Search Button | `button:has-text("Sök")` |
| Product Items | `div[class*="featured-product-grid-item"]` |
| Address Options | `[role="option"]` |

## Troubleshooting

### Tests Timeout
- Check internet connection
- Increase timeout in `playwright.config.ts`
- Run in debug mode: `npm run test:debug`

### Cookie Banner Not Dismissing
- The test handles both cases (banner present/absent)
- Check selector in `basePage.ts` dismissCookieBanner()

### Products Not Found
- Verify address is correctly entered
- Check product selector matches current DOM structure
- Use Playwright Inspector: `npx playwright codegen`

## Best Practices Used

✅ **Page Object Model**: Maintainable and reusable code
✅ **Real-time Assertions**: Immediate feedback on failures
✅ **Error Handling**: Graceful handling of optional elements
✅ **TypeScript**: Type safety and better IDE support
✅ **Allure Reporting**: Detailed test execution insights
✅ **Parallel Execution**: Faster test runs
✅ **Screenshots & Videos**: Visual debugging of failures

## CI/CD Integration

This project is ready for GitHub Actions integration with:
- Automated test execution on push/PR
- Allure report generation
- Artifact storage for reports
- GitHub Pages deployment (optional)

## Technologies Used

- **Playwright** 1.64+ - Browser automation
- **TypeScript** 7.0+ - Type-safe code
- **Allure** 2.46+ - Test reporting
- **Node.js** 18+ - Runtime environment

## Author

Sajid Manzoor (sajidmanzoor50@gmail.com)

## License

ISC

---

**Last Updated**: October 29, 2026
