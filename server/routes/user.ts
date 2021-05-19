import { Router } from 'express';
// custom
import { hasErros, isAuthenticate, isGuest, reqSchema } from '../middlewares';
import { UserController } from './controllers';

const router = Router();

router.post(
  '/api/user/register',
  reqSchema.user.regiser,
  hasErros,
  UserController.register);

router.post(
  '/api/user/login',
  isGuest,
  reqSchema.user.login,
  hasErros,
  UserController.login);

router.get(
  '/api/user/isLoggedIn',
  isAuthenticate,
  UserController.isLoggedIn);

router.post(
  '/api/user/logout',
  isAuthenticate,
  UserController.logout);

router.post(
  '/api/user/forgot-password',
  reqSchema.user.forgotPassword,
  hasErros,
  UserController.forgotPassword);

router.post(
  '/api/user/reset-password',
  reqSchema.user.resetPassword,
  hasErros,
  UserController.resetPassword);

router.get(
  '/api/user/qr/setup',
  isAuthenticate,
  UserController.qrSetup);

router.post(
  '/api/user/qr/verify',
  isAuthenticate,
  reqSchema.qr.verify,
  hasErros,
  UserController.qrVerify);

export { router as userRouter };
