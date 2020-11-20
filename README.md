[![Build Status](https://travis-ci.com/mivanov-dev/angular-angularmaterial.svg?branch=master)](https://travis-ci.com/mivanov-dev/angular-angularmaterial) ![GitHub](https://img.shields.io/github/license/mivanov-dev/angular-angularmaterial)

# AngularAngularMaterial
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11+.

## Server

### Without SSR
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### With SSR
If you want to work correctly with real data, fill this `.env` file before that. Run `npm run ssr` to build client and server part. After build all parts, the server will automatically start. Navigate to `http://localhost:4200/`, to see the result.

## Build

### Without SSR
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### With SSR
Run `npm run build:ssr` to build the project. The build artifacts will be stored in the `dist/` directory. We use `--prod` flag for a production build.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running e2e tests

### With GUI
Run `npm run e2e` to execute the e2e tests with GUI via [Protractor](http://www.protractortest.org/).

### Without GUI
Run `npm run e2e-headless` to execute the e2e tests without GUI via [Protractor](http://www.protractortest.org/).

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## More commands
You can find in `package.json` file.

