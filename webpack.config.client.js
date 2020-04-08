let webpack = require("webpack");
let dotenv = require("dotenv");

dotenv.config({ path: "./.env", encoding: 'utf-8' });

const protocol = process.env.PROTOCOL || 'http';
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '4200';

const proxy = Boolean(process.env.PROXY) || false;
const proxyProtocol = process.env.PROXY_PROTOCOL || 'http';
const proxyHost = process.env.PROXY_HOST || 'localhost';
const proxyPort = process.env.PROXY_PORT || '3000';

const isDev = process.env.NODE_ENV === 'development'

let config = {
    mode: isDev ? 'development' : 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                // Base
                PROTOCOL: JSON.stringify(protocol),
                HOST: JSON.stringify(host),
                PORT: JSON.stringify(port),
                // Proxy
                PROXY: proxy,
                PROXY_PROTOCOL: JSON.stringify(proxyProtocol),
                PROXY_HOST: JSON.stringify(proxyHost),
                PROXY_PORT: JSON.stringify(proxyPort),
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