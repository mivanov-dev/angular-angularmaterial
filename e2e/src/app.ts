import { browser, ExpectedConditions as EC, element, by, ElementFinder } from 'protractor';

export class App {

    getLoadingIndicator(): ElementFinder {

        return element(by.id('loading-box'));

    }

    async checkVisibilityLoadingIndicator(): Promise<void> {
        await browser.wait(EC.visibilityOf(this.getLoadingIndicator()));
    }

}
