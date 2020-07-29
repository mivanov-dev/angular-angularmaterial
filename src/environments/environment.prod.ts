declare var process: any;

export const environment = {
  production: true,
  host: process.env.HOST,
  port: +process.env.PORT,
  seoHost: process.env.SEO_HOST,
  seoPort: +process.env.SEO_PORT,
  seoProtocol: process.env.SEO_PROTOCOL,
  google: {
    analytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  request: {
    apiUserRegister: '/api/user/register',
    apiUserLogin: '/api/user/login',
    apiUserIsLoggedIn: '/api/user/isLoggedIn',
    apiUserLogout: '/api/user/logout',
    apiUserForgotPassword: '/api/user/forgot-password',
    apiUserResetPassword: '/api/user/reset-password'
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
