import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  protected cookieButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cookieButtons = this.page.locator('button').filter({
      hasText: /acceptera|godkänn|accept/i
    });
  }

  async navigateTo(url: string): Promise<void> {
    console.log(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async dismissCookieBanner(): Promise<void> {
    console.log('Attempting to dismiss cookie banner');
    const appeared = await this.cookieButtons
      .first()
      .waitFor({ state: 'visible', timeout: 6000 })
      .then(() => true)
      .catch(() => false);

    if (appeared) {
      await this.cookieButtons.first().click();
      await this.cookieButtons.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      console.log('Cookie banner dismissed');
    } else {
      console.log('Cookie banner not found or already dismissed');
    }
  }

  async waitForPageLoad(): Promise<void> {
    console.log('Waiting for page to load');
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      console.log('Page loaded successfully');
    } catch {
      console.log('Page load timeout, continuing anyway');
    }
  }
}
