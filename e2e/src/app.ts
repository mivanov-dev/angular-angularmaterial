import { browser, by, element, ElementFinder } from 'protractor';

export class App {

    getLoadingIndicator(id: string): ElementFinder {
        return element(by.id(id));
    }

}
