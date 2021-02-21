import * as webpack from 'webpack';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env', encoding: 'utf-8' });

console.log('env:', process.env);
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {}
  })
];

const config: webpack.Configuration = {

};

export default config;
