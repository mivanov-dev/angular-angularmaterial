import { browser } from 'protractor';

export class HomePage {

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return browser.getTitle() as Promise<string>;
  }

}
