// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/features/**/*.feature'],
  capabilities: {
    browserName: 'chrome'
  },
  chromeDriver: "../node_modules/chromedriver/lib/chromedriver/chromedriver.exe",
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: ['./src/steps/**/*.steps.ts'],
    format: [
      'json:cucmber.json'
    ],
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    })
  },
  onComplete() {
    var reporter = require('cucumber-html-reporter');
    var options = {
      theme: 'bootstrap',
      jsonFile: 'e2e/report/cucmber.json',
      output: 'e2e/report/cucmber.html',
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: true,
    };
    reporter.generate(options);
  }
};