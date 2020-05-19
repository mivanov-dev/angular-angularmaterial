import { expect } from 'chai';
import {
  setDefaultTimeout,
  Before, Given, When, Then
} from 'cucumber';
import {
  browser,
  ExpectedConditions as EC
} from 'protractor';
const ms = require('ms');
// custom
import { App } from '../app';
import { HomePage } from '../pages/home.po';

setDefaultTimeout(ms('1m'));

let homePage: HomePage;
let app: App;

Before(() => {

  app = new App();
  homePage = new HomePage();
  browser.waitForAngularEnabled(false);

});

Given(/^Start application$/,
  async () => {

    await homePage.navigateTo();

  });

When(/^I see the loading indicator with id "([^"]*)?"$/,
  async (id) => {

    await browser.wait(EC.visibilityOf(app.getLoadingIndicator(id)));

  });

Then(/^I should see the title "([^"]*)?"$/,
  async (title) => {

    expect(await homePage.getTitleText()).to.equal(title);

  });

When(/^I can not see more loading indicator with id "([^"]*)?"$/,
  async (id) => {

    await browser.wait(EC.invisibilityOf(app.getLoadingIndicator(id)));

  });
