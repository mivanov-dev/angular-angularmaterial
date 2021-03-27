import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as speakeasy from 'speakeasy';
// custom
import { User, UserImage } from './mongoose/models';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  },
  (req, email, password, cb) => {

    process.nextTick(async () => {

      try {

        const body = req.body as { email: string; password: string, otpCode?: string };

        const user = await User.findOne({ email: body.email })
          .select('email password role is2FAenabled tfaSecret')
          .populate({
            path: 'imageId',
            model: UserImage,
            select: 'url'
          }).exec();

        if (user && await User.isComparedPasswords(body.password, user.password)) {
          if (user.is2FAenabled) {
            if (body.otpCode) {
              const isVerified = speakeasy.totp.verify({
                secret: user.tfaSecret as string,
                encoding: 'base32',
                token: body.otpCode
              });

              if (!isVerified) {
                throw { name: 'OtpError', message: 'Please enter a valid OTP code' };
              }
              else {
                return cb(null, user);
              }
            }
            else {
              throw { name: 'OtpError', message: 'Please enter a OTP code' };
            }
          }
          else {
            return cb(null, user);
          }
        }
        else {
          return cb({ message: 'Wrong credentials!' }, false);
        }

      }
      catch (error) {
        return cb(error);
      }

    });

  });

passport.use('login', localStrategy);
passport.serializeUser((user: any, cb) => cb(null, user.id));
passport.deserializeUser(async (id: any, cb) => {

  try {

    const user = await User.findById(id).select('id').exec();

    if (user) {
      cb(null, user);
    }

  } catch (error) {
    cb(error);
  }

});

export { passport as passportStrategy };

