// base
const appUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`;
// proxy
const proxy = process.env.PROXY;
const proxyUrl = `${process.env.PROXY_PROTOCOL}://${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`;

export const environment = {
  production: false,
  appUrl,
  google: {
    analytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  request: {
    apiUserRegister: proxy ? `${proxyUrl}/api/user/register` : `${appUrl}/api/user/register`,
    apiUserLogin: proxy ? `${proxyUrl}/api/user/login` : `${appUrl}/api/user/login`,
    apiUserIsLoggedIn: proxy ? `${proxyUrl}/api/user/isLoggedIn` : `${appUrl}/api/user/isLoggedIn`,
    apiUserLogout: proxy ? `${proxyUrl}/api/user/logout` : `${appUrl}/api/user/logout`,
    apiUserForgotPassword: proxy ? `${proxyUrl}/api/user/forgot-password` : `${appUrl}/api/user/forgot-password`,
    apiUserResetPassword: proxy ? `${proxyUrl}/api/user/reset-password` : `${appUrl}/api/user/reset-password`
  },
  cloudinary: {
    server: process.env.CLOUDINARY_SERVER,
    url: {
      uploadImage: process.env.CLOUDINARY_UPLOAD_IMAGE_URL
    },
    cloudName: process.env.CLOUDINARY_CLOUDNAME,
    presets: process.env.CLOUDINARY_PRESETS
  }
};