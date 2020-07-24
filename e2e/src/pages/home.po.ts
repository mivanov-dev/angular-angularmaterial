import { browser } from 'protractor';

export class HomePage {

  async navigateTo(): Promise<any> {
    return await browser.get(browser.baseUrl);
  }

  async getTitleText(): Promise<string> {
    return await browser.getTitle();
  }

}
