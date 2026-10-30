import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class BreddbandPage extends BasePage {
  private broadbandNavTrigger: Locator;
  private bredbandViaFiberLink: Locator;
  private addressInput: Locator;
  private addressOptions: Locator;
  private productGridItems: Locator;
  private productGridContainer: Locator;
  private pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.broadbandNavTrigger = this.page.getByRole('button', { name: /^(Broadband|Bredband)$/i }).first();
    this.bredbandViaFiberLink = this.page.getByRole('link', { name: /^Bredband via fiber/i }).first();
    this.addressInput = this.page.locator('input[type="text"]').first();
    this.addressOptions = this.page.locator('[role="option"]');
    this.productGridContainer = this.page.locator('[data-test="featured-fixed-product-grid-item-container"]').first();
    this.productGridItems = this.productGridContainer.locator('> div');
    this.pageTitle = this.page.locator('main#main h1').first();
  }

  async navigateToHomepage(): Promise<void> {
    console.log('Navigating to Telenor homepage');
    await this.navigateTo('/');
  }

  async openBroadbandMenu(): Promise<void> {
    console.log('Clicking Broadband nav item to open dropdown');
    await this.broadbandNavTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await this.broadbandNavTrigger.click();

    await expect(this.broadbandNavTrigger).toHaveAttribute('aria-expanded', 'true', { timeout: 5000 });
    await expect(this.bredbandViaFiberLink).toBeVisible({ timeout: 5000 });
    console.log('✓ Broadband dropdown opened and submenu items are visible');
  }

  async clickBredbandViaFiber(): Promise<void> {
    console.log('Clicking Bredband via fiber link');
    await this.bredbandViaFiberLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.bredbandViaFiberLink.click();
    await this.waitForPageLoad();
    console.log('✓ Navigated to Bredband via fiber page');
  }

  async navigateToBredband(): Promise<void> {
    console.log('Navigating to Bredband page via homepage click-through');
    await this.navigateToHomepage();
    await this.dismissCookieBanner();
    await this.openBroadbandMenu();
    await this.clickBredbandViaFiber();
  }

  async getAddressInputValue(): Promise<string | null> {
    console.log('Getting address input value');
    try {
      return await this.addressInput.inputValue();
    } catch {
      return null;
    }
  }

  async isAddressInputEmpty(): Promise<boolean> {
    console.log('Checking if address input is empty');
    const value = await this.getAddressInputValue();
    return !value || value.trim() === '';
  }

  async isAddressInputVisible(): Promise<boolean> {
    console.log('Checking if address input is visible');
    try {
      await this.addressInput.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async fillAddress(address: string): Promise<void> {
    console.log(`Filling address: ${address}`);

    await this.addressInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.addressInput.fill(address);

    await expect(this.addressInput).toHaveValue(address, { timeout: 5000 });
    console.log(`✓ Address filled successfully: ${address}`);
  }

  async areAddressSuggestionsVisible(): Promise<boolean> {
    console.log('Checking if address suggestions are visible');
    try {
      await this.addressOptions.first().waitFor({ state: 'visible', timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  async selectAddressSuggestion(address: string): Promise<void> {
    console.log('Selecting address suggestion');

    const streetPart = address.split(',')[0];
    const matchingOption = this.addressOptions.filter({ hasText: new RegExp(streetPart, 'i') }).first();
    await matchingOption.waitFor({ state: 'visible', timeout: 10000 });
    await matchingOption.click();

    await this.addressOptions.first().waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {
      console.log('Suggestions list did not hide within timeout, continuing');
    });

    console.log('✓ Address suggestion selected');
  }

  async submitAddressSearch(address: string): Promise<void> {
    console.log('Submitting address search');

    const hasSuggestions = await this.areAddressSuggestionsVisible();

    if (hasSuggestions) {
      await this.selectAddressSuggestion(address);
    } else {
      await this.page.keyboard.press('Enter');
      console.log('No suggestion available, pressed Enter to submit search');
    }
  }

  async getProductGridItemCount(): Promise<number> {
    console.log('Getting product grid item count');

    await this.productGridContainer.waitFor({ state: 'visible', timeout: 15000 });
    const count = await this.productGridItems.count();
    console.log(`Found ${count} product items`);
    return count;
  }

  async isProductGridVisible(): Promise<boolean> {
    console.log('Checking if product grid is visible');
    try {
      await this.productGridContainer.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isFirstProductVisible(): Promise<boolean> {
    console.log('Checking if first product is visible');
    try {
      const firstProduct = this.productGridItems.first();
      await firstProduct.waitFor({ state: 'visible', timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyProductGridNotEmpty(): Promise<void> {
    console.log('Verifying product grid is not empty');

    const count = await this.getProductGridItemCount();
    expect(count).toBeGreaterThan(0);

    console.log(`✓ Product grid verified with ${count} items`);
  }

  async verifyProductGridVisible(): Promise<void> {
    console.log('Verifying product grid is visible');

    const isVisible = await this.isProductGridVisible();
    expect(isVisible).toBeTruthy();

    console.log('✓ Product grid is visible');
  }

  async verifyFirstProductVisible(): Promise<void> {
    console.log('Verifying first product is visible');

    const isVisible = await this.isFirstProductVisible();
    expect(isVisible).toBeTruthy();

    console.log('✓ First product is visible');
  }

  async verifyPageTitle(): Promise<void> {
    console.log('Verifying page title contains Bredband');

    await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    const headingText = await this.pageTitle.textContent();
    expect(headingText).toMatch(/bredband|broadband/i);

    console.log('✓ Page title verified');
  }

  async enterAddressIfEmpty(address: string): Promise<void> {
    console.log('Checking and entering address if needed');

    const isEmpty = await this.isAddressInputEmpty();

    if (isEmpty) {
      console.log('Address field is empty, filling it');
      await this.fillAddress(address);
      await this.submitAddressSearch(address);
      await this.waitForPageLoad();
    } else {
      const currentValue = await this.getAddressInputValue();
      console.log(`Address already filled: ${currentValue}`);
    }
  }

  async completeAddressSearch(address: string): Promise<void> {
    console.log('Completing address search workflow');

    const isVisible = await this.isAddressInputVisible();
    expect(isVisible).toBeTruthy();

    await this.enterAddressIfEmpty(address);
    await this.waitForPageLoad();

    console.log('✓ Address search completed');
  }

  async verifyProductsDisplay(): Promise<void> {
    console.log('Verifying products are displayed');

    await this.verifyProductGridNotEmpty();
    await this.verifyProductGridVisible();
    await this.verifyFirstProductVisible();

    console.log('✓ All products verified');
  }

  async initializePageSetup(address: string): Promise<void> {
    console.log('Initializing page setup');

    await this.dismissCookieBanner();
    await this.verifyPageTitle();
    await this.completeAddressSearch(address);

    console.log('✓ Page setup completed');
  }
}
