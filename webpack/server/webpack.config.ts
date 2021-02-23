import * as webpack from 'webpack';
import * as dotenv from 'dotenv';
import * as path from 'path';
const nodeExternals = require('webpack-node-externals');

dotenv.config({ path: './.env', encoding: 'utf-8' });

const rootDir = process.cwd();

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NG_BUILD_IVY_LEGACY: 1
    }
  })
]
  .concat([
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for "WARNING Critical dependency: the request of a dependency is an expression"
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {}, // a map of your routes
    ),
  ])
  .concat([
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src')
    )
  ]);

const config: webpack.Configuration = {
  // mode: 'production',
  // entry: { server: './server.ts' },
  // resolve: { extensions: ['.ts', '.js'] },
  // target: 'node',

  // this makes sure we include node_modules and other 3rd party libraries
  // externals: [nodeExternals()],
  // externals: {
  //   './dist/server/main': 'require("./server/main")',
  // },

  // output: {
  //   path: path.join(rootDir, 'dist', 'server'),
  //   filename: '[name].js'
  // },
  // module: {
  //   rules: [
  //     { test: /\.ts$/, loader: 'ts-loader' },
  //     {
  //       // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
  //       // Removing this will cause deprecation warnings to appear.
  //       test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
  //       parser: { system: true },
  //     },
  //   ]
  // },
  // plugins
};

export default config;
