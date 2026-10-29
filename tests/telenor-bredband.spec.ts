import { test, expect } from '@playwright/test';
import { config } from '../api-test.config';
import { BreddbandPage } from '../pages/bredband.page';

test.describe('Telenor Bredband E2E GUI Tests', () => {
  let breddbandPage: BreddbandPage;

  test.beforeEach(async ({ page }) => {
    breddbandPage = new BreddbandPage(page);
  });

  test('TC-001: Navigate to Bredband, enter address, and verify featured products', async () => {
    console.log('=== Starting TC-001 ===');

    await test.step('Navigate to Bredband page', async () => {
      await breddbandPage.navigateToBredband();
    });

    await test.step('Initialize page (dismiss cookie, verify title, enter address)', async () => {
      await breddbandPage.initializePageSetup(config.guiTests.address);
    });

    await test.step('Verify products display', async () => {
      await breddbandPage.verifyProductsDisplay();
    });

    console.log('=== TC-001 Completed Successfully ===');
  });

  test('TC-002: Verify Bredband page heading', async () => {
    console.log('=== Starting TC-002 ===');

    await test.step('Navigate to Bredband page', async () => {
      await breddbandPage.navigateToBredband();
    });

    await test.step('Verify page title', async () => {
      await breddbandPage.dismissCookieBanner();
      await breddbandPage.verifyPageTitle();
    });

    console.log('=== TC-002 Completed Successfully ===');
  });

  test('TC-003: Verify address input field is present', async () => {
    console.log('=== Starting TC-003 ===');

    await test.step('Navigate to Bredband page', async () => {
      await breddbandPage.navigateToBredband();
    });

    await test.step('Verify address input field exists', async () => {
      const isVisible = await breddbandPage.isAddressInputVisible();
      expect(isVisible).toBeTruthy();
      console.log('✓ Address input field is present and visible');
    });

    console.log('=== TC-003 Completed Successfully ===');
  });

  test('TC-004: Verify product count and visibility', async () => {
    console.log('=== Starting TC-004 ===');

    await test.step('Navigate and initialize page', async () => {
      await breddbandPage.navigateToBredband();
      await breddbandPage.initializePageSetup(config.guiTests.address);
    });

    await test.step('Verify products count', async () => {
      const count = await breddbandPage.getProductGridItemCount();
      expect(count).toBeGreaterThan(0);
      console.log(`✓ Product count verified: ${count} items`);
    });

    await test.step('Verify product visibility', async () => {
      const isGridVisible = await breddbandPage.isProductGridVisible();
      expect(isGridVisible).toBeTruthy();

      const isFirstVisible = await breddbandPage.isFirstProductVisible();
      expect(isFirstVisible).toBeTruthy();

      console.log('✓ All products verified as visible');
    });

    console.log('=== TC-004 Completed Successfully ===');
  });
});
