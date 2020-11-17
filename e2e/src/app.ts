import { $, ElementFinder } from 'protractor';

export class App {

  getLoadingIndicator(): ElementFinder {

    return $('#loading-box');

  }

}
