import { NextFunction, Response, Request, Express } from 'express';
import * as crypto from 'crypto';
import { validationResult } from 'express-validator';
import * as bcrypt from 'bcryptjs';
const ms = require('ms');
// custom
import { UserImage, User, UserImageDocument } from '../../mongoose/models';
import { handleErrors } from '../../middlewares';
import { passportStrategy } from '../../passport';
import { smtp } from '../../smtp';
import { config } from '../../config';

class Controller {

    static register = async (req: Request | any, res: Response, next: NextFunction): Promise<void | Response<any>> => {

        try {

            let { password } = req.body;
            const { email } = req.body;
            const errors: any = validationResult(req);
            let userImage: UserImageDocument;

            if (!errors.isEmpty()) {
                throw { message: errors.errors[0].msg };
            }
            else if (await User.findOne({ email })) {
                throw { message: 'This email already exists!' };
            }
            else if (new Object(req.body).hasOwnProperty('file')) {
                userImage = await new UserImage({ url: req.body.file }).save();
            }
            else {
                userImage = await new UserImage().save();
            }

            password = await bcrypt.hashSync(password, 10);

            await User.create({ email, password, imageId: userImage._id });

            res.status(200).send({ message: 'Registration successful!' });

        }
        catch (error) {
            console.log(error);
            handleErrors(error, res);

        }

    }

    static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const errors: any = validationResult(req);

        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }

        passportStrategy.authenticate('login', (error, user, info): Response<any> | void => {

            if (error) { return handleErrors(error, res); }
            if (info !== undefined) { return res.status(400).send(info); }

            const json = {
                email: user.email,
                image: user.imageId.url,
                expires: ms('1m'),
                redirect: true
            };

            req.login(user, (err): Response<any> | void => {

                req.session = (req.session as Express.Session);

                if (error) {
                    return handleErrors(error, res);
                }
                else if (req.body.remember) {
                    req.session.cookie.originalMaxAge = ms('1m');
                    return res.status(200).send(json);
                }
                else {
                    req.session.cookie.expires = false;
                    return res.status(200).send(json);
                }

            });

        })(req, res, next);

    }

    static isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {

        try {

            const body = req.user as { id: any };
            let expires: number = ms('1m');
            const user = await User.isLoggedIn(body.id);

            if (req?.session?.cookie.originalMaxAge) {
                req.session.cookie.originalMaxAge = ms('1m');

                expires = (req.session.cookie.expires as Date).getTime() - Date.now();
            }

            return res.status(200)
                .send({
                    email: user.email,
                    image: user.imageId.url,
                    expires,
                    redirect: false
                });

        }
        catch (error) {

            handleErrors(error, res);

        }
    }

    static logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        req.logout();
        res.clearCookie('uid');
        res.status(200).send();

    }

    static forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {

        const { host, port } = config;

        try {

            const { email } = req.body;
            const errors: any = validationResult(req);

            if (!errors.isEmpty()) {
                throw { message: errors.errors[0].msg };
            }

            let user = await User.findOne({ email });

            if (user) {
                user.resetPasswordToken = crypto.randomBytes(16).toString('hex');
                user.resetPasswordExpires = Date.now() + ms('1m');
                user = await user.save();
            }

            res.status(200).send({ message: `If your email exists in our database, you will receive a reset link shortly!` });

            if (user) {
                const to = user.email;
                const subject = 'Reset password !';
                const html = `
                    <p>Reset your password !</p>
                    <a href="http://${host}:${port}/#/user/reset-password/${user.resetPasswordToken}" target="_blank">
                        Click here !
                    </a>`;
                smtp.sendMail(to, subject, html);
            }

            smtp.close();

        }
        catch (error) {

            handleErrors(error, res);

        }
    }

    static resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> => {

        try {

            const { token, password, repeatedPassword } = req.body;
            const errors: any = validationResult(req);

            if (!errors.isEmpty()) {
                throw { message: errors.errors[0].msg };
            }

            if (password.localeCompare(repeatedPassword) !== 0) {
                throw { message: 'New password and repeated password are not equals!' };
            }

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            })
                .exec();

            if (!user) {
                throw { message: 'Reset password token is invalid or has expired!' };
            }

            user.password = await bcrypt.hashSync(password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save();

            return res.status(200).end();
        }
        catch (error) {

            handleErrors(error, res);

        }

    }

}


export { Controller as UserController };
