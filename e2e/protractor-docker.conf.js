// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  getPageTimeout: 10000,
  allScriptsTimeout: 10000,
  specs: ['./src/features/**/*.feature'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      'args': [
        '--disable-translate',
        '--disable-extensions',
        '--remote-debugging-port=9223',
        '--no-sandbox',
        '--headless',
        '--disable-gpu'
      ]
    }
  },
  directConnect: false,
  baseUrl: 'http://angular:4200/',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: ['./src/steps/**/*.steps.ts'],
    format: [
      `json:${require('path').join(__dirname, 'report', 'cucumber.json')}`
    ],
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, 'tsconfig.json')
    })

    const protractor = require('protractor');
    protractor.browser.manage().timeouts().implicitlyWait(20000);
  },
  onComplete() {
    var reporter = require('cucumber-html-reporter');
    var options = {
      theme: 'bootstrap',
      jsonFile: require('path').join(__dirname, 'report', 'cucumber.json'),
      output: require('path').join(__dirname, 'report', 'cucumber.html'),
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: true,
      screenshotsDirectory: require('path').join(__dirname, 'report'),
      storeScreenshots: true
    };
    reporter.generate(options);
  },
  SELENIUM_PROMISE_MANAGER: false,
  seleniumAddress: "http://selenium:4444/wd/hub"
};
