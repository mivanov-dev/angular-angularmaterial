// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    browserConsoleLogOptions: { level: "info", terminal: true },
    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9223',
          '--no-sandbox',
          '--headless',
          '--disable-gpu'
        ]
      }
    },
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      'karma-spec-reporter',
      '@angular-devkit/build-angular/plugins/karma'
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    coverageReporter: {
      dir: 'coverage/',
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly', file: 'lcov.info' },
        { type: 'json-summary', file: 'coverage.json' },
      ],
      check: {
        global: {
          statements: 20,
          branches: 20,
          functions: 20,
          lines: 20,
        },
      },
      fixWebpackSourcePaths: true,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
      suppressFailed: true
    },
    reporters: ['spec'],
    specReporter: {
      maxLogLines: 10,
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: false,
      showSpecTiming: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  });
};
