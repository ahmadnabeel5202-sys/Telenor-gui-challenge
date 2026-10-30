# Telenor Bredband GUI Challenge

Playwright + TypeScript end-to-end test suite that automates the real telenor.se click path: homepage → Broadband nav dropdown → "Bredband via fiber" → address search → featured product grid verification.

## Challenge requirements

1. Navigate to telenor.se
2. Click through to the Bredband section
3. Enter address: `Kungsgatan 103, Uppsala`
4. Verify the featured product grid is not empty

See [ASSUMPTIONS.md](ASSUMPTIONS.md) for every deviation from the literal brief and the real-site findings behind each one (e.g. the actual nav path, the real grid selector, the suggestion-select-submits-the-search behavior).

## Setup

```bash
npm install
npx playwright install chromium
```

## Running the tests

```bash
npm test                # run the full suite (headless, 1 worker, sequential)
npm run test:debug      # step-by-step Playwright Inspector
npm run test:ui         # interactive UI mode
npm run test:report     # open the Playwright HTML report from the last run
```

## Allure reporting

```bash
npm run allure:generate   # generate allure-report/ from allure-results/
npm run allure:report     # generate and open it locally
npm run allure:clean      # remove allure-results/ and allure-report/
```

In CI, the Allure report is uploaded as a workflow artifact on every run and deployed to GitHub Pages on every push to `main`.

## Project structure

```
pages/
  basePage.ts             shared SPA chrome: navigation, cookie consent
  bredband.page.ts         Bredband feature page: nav dropdown, address
                            search, product grid
tests/
  telenor-bredband.spec.ts the 4 test cases, calling only page-object methods
api-test.config.ts          base URL and test address
playwright.config.ts        Playwright + Allure reporter config
.github/workflows/
  e2e-tests.yml              runs the suite on push/PR, deploys Allure to Pages
```

All locators are declared in each page class's constructor. All interactions and assertions are methods on the page classes. The test file only calls those methods and asserts on their return values — it contains no selectors. Waits are dynamic (`waitFor`, `expect(...).toHaveValue/toBeVisible`); there are no fixed-duration sleeps.

## Test cases

| ID | What it checks |
|---|---|
| TC-001 | Full workflow: navigate, enter address, verify the product grid is populated and visible |
| TC-002 | The Bredband page heading is reached after the real nav click-through |
| TC-003 | The address input field is present and visible |
| TC-004 | Product count and visibility after a successful address search |

## CI/CD

`.github/workflows/e2e-tests.yml` runs on every push and pull request to `main`/`develop`:

- Installs dependencies and Chromium
- Runs the suite (`npm test`)
- Generates the Allure report
- Uploads the Allure report, raw Allure results, and Playwright HTML report as artifacts
- On pushes to `main` only: deploys the Allure report to GitHub Pages

Repository must have **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**, and must be public (or on a paid plan) for Pages to be available at all — see [ASSUMPTIONS.md](ASSUMPTIONS.md) for details.

## Branching

See [BRANCHING.md](BRANCHING.md) for the branching strategy used in this repository (feature branch → PR → merge into `main`; CI gates every merge).
