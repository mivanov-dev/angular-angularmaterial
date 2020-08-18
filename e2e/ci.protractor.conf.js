// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    getPageTimeout: 20000,
    allScriptsTimeout: 20000,
    specs: ['./src/features/**/*.feature'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                // '--disable-translate',
                // '--disable-extensions',
                // '--remote-debugging-port=9223',
                '--no-sandbox',
                '--headless',
                // '--disable-gpu'
            ]
        }
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
};