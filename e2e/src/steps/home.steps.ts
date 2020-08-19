import { expect } from 'chai';
import { Before, Given, When, Then, setDefaultTimeout, AfterAll, BeforeAll } from 'cucumber';
import { browser, ExpectedConditions as EC } from 'protractor';
const ms = require('ms');
// custom
import { App } from '../app';
import { HomePage } from '../pages/home.po';

let homePage: HomePage;
let app: App;

setDefaultTimeout(ms('1m'));

Before(async () => {

  await browser.waitForAngularEnabled(false);

  app = new App();
  homePage = new HomePage();

});

Given(/^web browser is on home page$/,
  async () => {

    // await browser.waitForAngularEnabled(false);

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

    expect(await app.getLoadingIndicator().getCssValue('display')).to.be.not.equal('none');

  });

Then(/^I should see the title "([^"]*)?"$/,
  async (title) => {

    expect(await homePage.getTitleText()).to.be.equal(title);

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

    expect(await app.getLoadingIndicator().getCssValue('display')).to.be.equal('none');

  });

AfterAll(() => {

  return browser.driver.quit();

});
