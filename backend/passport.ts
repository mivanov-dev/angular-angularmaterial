import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// custom
import { config } from './config';
import { User } from './mongoose/models';

const google = config.google;
const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: true,
        passReqToCallback: true
    },
    (request, _email, _password, cb) => {

        process.nextTick(async () => {

            try {

                const { password, email } = request.body;
                const user = await User.authenticate(email, password);

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

        const user = await User.findById(id).select('id').exec();
        cb(null, user);

    } catch (error) {

        cb(error);

    }

});

export { passport as passportStrategy };