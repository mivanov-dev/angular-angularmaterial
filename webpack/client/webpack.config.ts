import * as webpack from 'webpack';
import * as CompressionPlugin from 'compression-webpack-plugin';
import * as dotenv from 'dotenv';

dotenv.config({ encoding: 'utf-8' });

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '4200';
const protocol = process.env.PROTOCOL = 'http';

const seoHost = process.env.SEO_HOST || host;
const seoPort = process.env.SEO_PORT || port;
const seoProtocol = process.env.SEO_PROTOCOL || protocol;

const isDev = (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') === 'development';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      // Base
      HOST: JSON.stringify(host),
      PORT: JSON.stringify(port),
      SEO_HOST: JSON.stringify(seoHost),
      SEO_PORT: JSON.stringify(seoPort),
      SEO_PROTOCOL: JSON.stringify(seoProtocol),
      // Google
      GOOGLE_ANALYTICS_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX'),
      // Cloudinary
      CLOUDINARY_SERVER: JSON.stringify(process.env.CLOUDINARY_SERVER) as string,
      CLOUDINARY_UPLOAD_IMAGE_URL: JSON.stringify(process.env.CLOUDINARY_UPLOAD_IMAGE_URL) as string,
      CLOUDINARY_CLOUDNAME: JSON.stringify(process.env.CLOUDINARY_CLOUDNAME) as string,
      CLOUDINARY_PRESETS: JSON.stringify(process.env.CLOUDINARY_PRESETS) as string,
    }
  })
].concat(isDev ? [] : [
  new CompressionPlugin({
    test: /\.js$/i,
    exclude: /\/node_modules/i
  })
]);

const config: webpack.Configuration = {
  mode: isDev ? 'development' : 'production',
  plugins
};

export default config;
