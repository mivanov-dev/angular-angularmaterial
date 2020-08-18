import { expect } from 'chai';
import { Given, When, Then, setDefaultTimeout, BeforeAll } from 'cucumber';
import { browser, ExpectedConditions as EC } from 'protractor';
// custom
import { App } from '../app';
import { HomePage } from '../pages/home.po';

let homePage: HomePage;
let app: App;

setDefaultTimeout(60 * 1000);

BeforeAll(() => {

  setDefaultTimeout(60 * 1000);

  app = new App();
  homePage = new HomePage();

});

Given(/^web browser is on home page$/,
  async () => {

    await homePage.navigateTo();

  });

When(/^I load application$/,
  () => {

    return browser
      .wait(EC.visibilityOf(app.getLoadingIndicator()))
      .then(res => {
        console.log(1, res);
      })
      .catch(e => {
        throw new Error('FAIL');
      });

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
