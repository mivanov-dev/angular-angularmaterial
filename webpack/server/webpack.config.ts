import * as webpack from 'webpack';
import * as dotenv from 'dotenv';
import * as path from 'path';
// const nodeExternals = require('webpack-node-externals');

dotenv.config({ path: './.env', encoding: 'utf-8' });

const plugins: any = [
  new webpack.DefinePlugin({
  }),
  // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
  // for "WARNING Critical dependency: the request of a dependency is an expression"
  new webpack.ContextReplacementPlugin(
    /(.+)?angular(\\|\/)core(.+)?/,
    path.join(__dirname, 'src'), // location of your src
    {}, // a map of your routes
  ),
  new webpack.ContextReplacementPlugin(
    /(.+)?express(\\|\/)(.+)?/,
    path.join(__dirname, 'src')
  )
];

const config: webpack.Configuration = {
  externals: ['mongodb-client-encryption']
};

export default config;
