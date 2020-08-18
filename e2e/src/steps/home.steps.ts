import { expect } from 'chai';
import { Before, Given, When, Then, setDefaultTimeout } from 'cucumber';
import { browser, ExpectedConditions as EC } from 'protractor';
const ms = require('ms');
// custom
import { App } from '../app';
import { HomePage } from '../pages/home.po';

let homePage: HomePage;
let app: App;

// setDefaultTimeout(ms('20s'));

Before(async () => {

  app = new App();
  homePage = new HomePage();

  await browser.waitForAngularEnabled(false);

});

Given(/^web browser is on home page$/,
  async () => {

    await homePage.navigateTo();

  });

When(/^I load application$/,
  async () => {

    // await browser.wait(EC.visibilityOf(app.getLoadingIndicator()));
    await browser.wait(async () => await app.getLoadingIndicator().isDisplayed());

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

    await browser.wait(EC.invisibilityOf(app.getLoadingIndicator()));

  });

Then(/^I should't see more loading indicator$/,
  async () => {

    expect(await app.getLoadingIndicator().getCssValue('display')).to.be.equal('none');

  });
