let webpack = require("webpack");
let dotenv = require("dotenv");

dotenv.config({ path: "./.env", encoding: 'utf-8' });

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '4200';
const protocol = process.env.PROTOCOL = 'http';

const seoHost = process.env.SEO_HOST || host;
const seoPort = process.env.SEO_PORT || port;
const seoProtocol = process.env.SEO_PROTOCOL || protocol;

const isDev = process.env.NODE_ENV === 'development'

let config = {
    mode: isDev ? 'development' : 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                // Base
                HOST: JSON.stringify(host),
                PORT: JSON.stringify(port),
                SEO_HOST: JSON.stringify(seoHost),
                SEO_PORT: JSON.stringify(seoPort),
                SEO_PROTOCOL: JSON.stringify(seoProtocol),
                // Google
                GOOGLE_ANALYTICS_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX'),
                // Cloudinary
                CLOUDINARY_SERVER: JSON.stringify(process.env.CLOUDINARY_SERVER),
                CLOUDINARY_UPLOAD_IMAGE_URL: JSON.stringify(process.env.CLOUDINARY_UPLOAD_IMAGE_URL),
                CLOUDINARY_CLOUDNAME: JSON.stringify(process.env.CLOUDINARY_CLOUDNAME),
                CLOUDINARY_PRESETS: JSON.stringify(process.env.CLOUDINARY_PRESETS),
            }
        })
    ]
};

module.exports = config;