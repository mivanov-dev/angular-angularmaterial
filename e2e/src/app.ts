import { browser, by, element } from 'protractor';

export class App {

    getLoadingIndicator(id: string) {
        return element(by.id(id));
    }

}
