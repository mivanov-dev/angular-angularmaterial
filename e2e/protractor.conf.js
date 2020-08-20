// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  getPageTimeout: 11000,
  allScriptsTimeout: 11000,
  specs: ['./src/features/**/*.feature'],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: ['./src/steps/**/*.steps.ts'],
    format: [
      `json:${__dirname}\\report\\cucumber.json`
    ],
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    })

    const protractor = require('protractor');
    protractor.browser.manage().timeouts().implicitlyWait(20000);
  },
  onComplete() {
    var reporter = require('cucumber-html-reporter');
    var options = {
      theme: 'bootstrap',
      jsonFile: `${__dirname}\\report\\cucumber.json`,
      output: `${__dirname}\\report\\cucumber.html`,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: true,
    };
    reporter.generate(options);
  },
  SELENIUM_PROMISE_MANAGER: false,
  seleniumAddress: 'http://localhost:4444/wd/hub',
};