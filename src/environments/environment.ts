import { buildReqUrl } from './utils';
// base
const baseUrl = process.env.BASE_URL;
// proxy
const hasProxy = process.env.HAS_PROXY;
const proxyBaseUrl = process.env.PROXY_BASE_URL;

export const environment = {
  production: false,
  baseUrl,
  host: process.env.HOST,
  port: +process.env.PORT,
  google: {
    analytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  request: {
    apiUserRegister: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/register'),
    apiUserLogin: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/login'),
    apiUserIsLoggedIn: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/isLoggedIn'),
    apiUserLogout: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/logout'),
    apiUserForgotPassword: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/forgot-password'),
    apiUserResetPassword: buildReqUrl(hasProxy, proxyBaseUrl, baseUrl, '/api/user/reset-password')
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
