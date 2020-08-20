import { expect } from 'chai';
import { Before, Given, When, Then, setDefaultTimeout, AfterAll } from 'cucumber';
import { browser, ExpectedConditions as EC } from 'protractor';
const ms = require('ms');
// custom
import { App } from '../app';
import { HomePage } from '../pages/home.po';

let homePage: HomePage;
let app: App;

function writeScreenShot(data: string, filename: string): void {
  const stream = require('fs').createWriteStream(`./e2e/report/${filename}`);
  // tslint:disable-next-line: deprecation
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

setDefaultTimeout(ms('1m'));

Before(async () => {

  app = new App();
  homePage = new HomePage();

});

Given(/^web browser is on home page$/,
  async () => {

    await homePage.navigateTo();

  });

When(/^I load application$/,
  async () => {

    await browser.waitForAngularEnabled(false);

    browser
      .wait(
        EC.visibilityOf(app.getLoadingIndicator()),
        5000,
        '#loading-box is not visible'
      );

  });

Then(/^I should see the loading indicator$/,
  async () => {

    browser.waitForAngularEnabled(false);

    try {
      expect(await (app.getLoadingIndicator().getCssValue('display') as Promise<string>)).to.be.not.equal('none');
    } catch (error) {
      browser.takeScreenshot().then(res => writeScreenShot(res, 'cucumber.png'));
    }

  });

Then(/^I should see the title "([^"]*)?"$/,
  async (title) => {

    browser.waitForAngularEnabled(false);

    try {
      expect(await homePage.getTitleText()).to.be.equal(title);
    } catch (error) {
      browser.takeScreenshot().then(res => writeScreenShot(res, 'cucumber.png'));
    }

  });

When(/^I finish with the loading process$/,
  async () => {

    await browser
      .wait(
        EC.invisibilityOf(
          app.getLoadingIndicator()),
        5000,
        '#loading-box is visible'
      );

  });

Then(/^I should't see more loading indicator$/,
  async () => {

    try {
      expect(await app.getLoadingIndicator().getCssValue('display')).to.be.equal('none');
    } catch (error) {
      browser.takeScreenshot().then(res => writeScreenShot(res, 'cucumber.png'));
    }

  });

AfterAll(() => {

  setTimeout(() => {

    browser.driver.quit();

  }, 100);

});
