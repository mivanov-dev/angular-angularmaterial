let webpack = require("webpack");
let dotenv = require("dotenv");

dotenv.config({ path: "./.env", encoding: 'utf-8' });

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '4200';
const baseUrl = `http://${host}:${port}`;

const hasProxy = process.env.HAS_PROXY || false;
const proxyHost = process.env.PROXY_HOST || 'localhost';
const proxyPort = process.env.PROXY_PORT || '3000';
const proxyBaseUrl = `http://${proxyHost}:${proxyPort}`;

const isDev = process.env.NODE_ENV === 'development'

let config = {
    mode: isDev ? 'development' : 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                // Base
                BASE_URL: JSON.stringify(baseUrl),
                HOST: JSON.stringify(host),
                PORT: JSON.stringify(port),
                // Proxy
                HAS_PROXY: Boolean(hasProxy),
                PROXY_BASE_URL: JSON.stringify(proxyBaseUrl),
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