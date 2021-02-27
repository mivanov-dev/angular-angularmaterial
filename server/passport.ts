import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
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

        const user = await User.findOne({ email: req.body.email })
          .select('email password role is2FAenabled tfaSecret')
          .populate({
            path: 'imageId',
            model: UserImage,
            select: 'url'
          }).exec();

        if (!user) {
          return cb({ message: 'Wrong credentials!' }, false);
        }
        if (!await User.isComparedPasswords(req.body.password, user.password)) {
          return cb({ message: 'Wrong credentials!' }, false);
        }

        return cb(null, user);
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

