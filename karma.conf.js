// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
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
      clearContext: false
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'json-summary', subdir: '.', file: 'coverage.json' },
      ],
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
      fixWebpackSourcePaths: true,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
      suppressFailed: true
    },
    reporters: ['progress', 'kjhtml', 'spec'],
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
