import { Router } from 'express';
// custom
import { isAuthenticate, reqSchema } from '../middlewares';
import { UserController } from './controllers';

const router = Router();

router.post(
    '/api/user/register',
    reqSchema.user.regiser,
    UserController.register);

router.post(
    '/api/user/login',
    reqSchema.user.login,
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
    UserController.forgotPassword);

router.post(
    '/api/user/reset-password',
    reqSchema.user.resetPassword,
    UserController.resetPassword);

export { router as userRouter };