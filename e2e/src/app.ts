import { by, element, ElementFinder } from 'protractor';

export class App {

    getLoadingIndicator(): ElementFinder {

        return element(by.id('loading-box'));

    }

}
