import { NextFunction, Response, Request } from 'express';
import { checkSchema } from 'express-validator';
// custom
import { log } from './logger';

export function isAuthenticate(req: Request, res: Response, next: NextFunction): Response<any> | void {

  log.info(`isAuthenticate: ${req.isAuthenticated()}`);

  if (req.isAuthenticated()) {
    next();
  } else {
    return res.sendStatus(401);
  }

}

export function handleErrors(error: any, res: Response): void {

  log.error(`handleErrors: ${JSON.stringify(error)}`);

  if (error.hasOwnProperty('errors')) {
    res.status(400).send({ error: error.errors });
  }
  else if (error.hasOwnProperty('message')) {
    res.status(400).send(error);
  }
  else {
    res.status(400).send({ message: 'Unknown an error!' });
  }

}

export function isGuest(req: Request, res: Response, next: NextFunction): void {

  if (req.isAuthenticated()) {
    res.status(400).send({ message: 'You are already logged in!' });
  } else {
    next();
  }

}

export const reqSchema = {
  user: {
    regiser: checkSchema({
      email: {
        isEmail: {
          errorMessage: 'Email is required!'
        },
        notEmpty: {
          errorMessage: 'Email is required!',
        },
        isLength: {
          errorMessage: 'Email length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      },
      password: {
        notEmpty: {
          errorMessage: 'Password is required!',
        },
        isLength: {
          errorMessage: 'Password length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      }
    }),
    login: checkSchema({
      email: {
        isEmail: {
          errorMessage: 'Email is required!'
        },
        notEmpty: {
          errorMessage: 'Email is required!',
        },
        isLength: {
          errorMessage: 'Email length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      },
      password: {
        notEmpty: {
          errorMessage: 'Password is required!',
        },
        isLength: {
          errorMessage: 'Password length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      }
    }),
    forgotPassword: checkSchema({
      email: {
        isEmail: {
          errorMessage: 'Email is required!'
        },
        notEmpty: {
          errorMessage: 'Email is required!',
        },
        isLength: {
          errorMessage: 'Email length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      }
    }),
    resetPassword: checkSchema({
      password: {
        custom: {
          options: (val, meta) => val === meta.req.body.repeatedPassword,
          errorMessage: 'New password and repeated password are not equals!'
        },
        notEmpty: {
          errorMessage: 'Password is required!',
        },
        isLength: {
          errorMessage: 'Password length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      },
      repeatedPassword: {
        custom: {
          options: (val, meta) => val === meta.req.body.password,
          errorMessage: 'New password and repeated password are not equals!'
        },
        notEmpty: {
          errorMessage: 'Repeated password is required!',
        },
        isLength: {
          errorMessage: 'Repeated password length must be between 10 and 100 characters!',
          options: { min: 10, max: 100 }
        }
      }
    })
  }
};

