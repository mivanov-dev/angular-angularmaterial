import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// custom
import { User, UserDocument } from './mongoose/models';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  },
  (request, email, password, cb) => {

    process.nextTick(async () => {

      try {

        const user = await User.authenticate(request.body);

        if (user == null) {
          return cb(null, false, { message: 'Wrong credentials!' });
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

    const user: UserDocument = await User.findById(id).select('id').exec();
    cb(null, user);

  } catch (error) {

    cb(error);

  }

});

export { passport as passportStrategy };

