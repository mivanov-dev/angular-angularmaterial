import { NextFunction, Response, Request } from 'express';
import * as crypto from 'crypto';
import { validationResult } from 'express-validator';
import * as bcrypt from 'bcryptjs';
const ms = require('ms');
// custom
import { UserImage, User, IUserImageDocument } from '../../mongoose/models';
import { handleErrors } from '../../middlewares';
import { passportStrategy } from '../../passport';
import { Smtp } from '../../smtp';
import { config } from '../../config';

const smtp = Smtp.getInstance();

class Controller {

    static register = async (req: Request | any, res: Response, next: NextFunction) => {

        try {

            let { password } = req.body;
            const { email } = req.body;
            const errors: any = validationResult(req);
            let userImage: IUserImageDocument;

            if (!errors.isEmpty()) {
                throw { message: errors.errors[0].msg };
            }
            if (await User.findOne({ email })) {
                throw { message: 'This email already exists!' };
            }
            if (new Object(req.body).hasOwnProperty('file')) {
                userImage = await UserImage.create({ url: req.body.file });
            }
            else {
                userImage = await UserImage.create({});
            }

            password = await bcrypt.hashSync(password, 10);

            await User.create({ email, password, imageId: userImage.id });

            res.status(200).send({ message: 'Registration successful!' });

        }
        catch (error) {

            handleErrors(error, res);

        }

    }

    static login = async (req: Request, res: Response, next: NextFunction) => {

        const expires = ms('1m');
        const errors: any = validationResult(req);

        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }

        passportStrategy.authenticate('login', async (error, user, info) => {

            if (error) { return handleErrors(error, res); }
            if (info !== undefined) { return res.status(400).send(info); }

            const json = {
                email: user.email,
                image: user.imageId.url,
                expires,
                redirect: true
            };

            req.login(user, (error) => {

                if (error) {
                    handleErrors(error, res);
                }
                else if (req.body.remember) {
                    req.session.cookie.originalMaxAge = expires;
                    return res.status(200).send(json);
                }
                else {
                    req.session.cookie.expires = false;
                    return res.status(200).send(json);
                }

            });

        })(req, res, next);

    }

    static isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const body = req.user as { id: any };
            let expires: number;
            const user = await User.isLoggedIn(body.id);

            if (!req.session.cookie.expires) {
                expires = new Date(Date.now() + ms('1m')).getTime();
            }
            else {
                expires = new Date(req.session.cookie.expires as Date).getTime();
            }

            return res.status(200)
                .send({
                    email: user.email,
                    image: user.imageId.url,
                    expires,
                    redirect: false
                });

        } catch (error) {

            return handleErrors(error, res);

        }
    }

    static logout = async (req: Request, res: Response, next: NextFunction) => {

        req.logout();
        res.clearCookie('uid');
        res.status(200).send();

    }

    static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

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

            return handleErrors(error, res);

        }
    }

    static resetPassword = async (req: Request, res: Response, next: NextFunction) => {

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
            });

            if (!user) {
                throw { message: 'Reset password token is invalid or has expired!' };
            }

            user.password = await bcrypt.hashSync(password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save();

            return res.sendStatus(200);
        }
        catch (error) {

            return handleErrors(error, res);

        }

    }

}


export { Controller as UserController };
