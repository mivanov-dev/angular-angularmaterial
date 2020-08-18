import { browser } from 'protractor';

export class HomePage {

  navigateTo(): Promise<any> {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText(): Promise<string> {
    return browser.getTitle() as Promise<string>;
  }

}
