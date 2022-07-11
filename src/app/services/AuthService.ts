import { compare } from 'bcryptjs';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { tokenRepository, userRepository } from '../entity/repositorys/repositorys';
import { User } from '../entity/User';
import { ErrorWithStats } from '../model/ErrorWithStats';
import transport from '../modules/mailer';
import { removeBearer, signHash } from '../utils/tokenProvider';

type authenticationRequest = {
    email: string;
    password: string;
};

type authenticationResponse = {
    token: string;
    user: User;
};

type refreshRequest = {
    token: string;
};

type refreshResponse = {
    token: string;
    user: User;
};

type forgotPasswordRequest = {
    email: string;
};

type sendPasswordRecoveryEmailRequest = {
    token: string;
    email: string;
};

type validatePasswordResetTokenRequest = {
    email: string;
    token: string;
};

export class AuthService {
    async authenticate({ email, password }: authenticationRequest): Promise<authenticationResponse | ErrorWithStats> {
        try {
            const user = await userRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'created_at', 'permission', 'updated_at', 'updated_at', 'userName'],
            });

            if (!user) return new ErrorWithStats('The email or password is incorrect', 401);

            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) return new ErrorWithStats('The email or password is incorrect', 401);

            //Creating a token, that expires in 1 hour
            const tokens = signHash({ user });

            delete user.password;

            return { user, token: tokens.bearer };
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async refresh({ token }: refreshRequest): Promise<refreshResponse | ErrorWithStats> {
        try {
            const validToken = await tokenRepository.findOne({
                where: { hash: removeBearer({ token }) },
                relations: ['user'],
            });

            if (!validToken) return new ErrorWithStats('This token is invalid', 401);

            //Creating a token, that expires in 1 hour
            const tokens = signHash({ user: validToken.user });

            return { user: validToken.user, token: tokens.bearer };
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async crateResetToken({ email }: forgotPasswordRequest): Promise<User | ErrorWithStats> {
        try {
            const user = await userRepository.findOne({
                where: { email },
            });

            if (!user) return new ErrorWithStats('There is no an user with this email', 404);

            //CRIANDO UM TOKEN PARA O USUARIO
            const token = signHash({ user }).hash;

            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1);

            user.password_reset_expires = expirationTime;
            user.password_reset_token = token;

            await userRepository.save(user);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async sendPasswordRecoveryEmail({
        email,
        token,
    }: sendPasswordRecoveryEmailRequest): Promise<boolean | ErrorWithStats> {
        try {
            const linkToFollow = `${process.env.FRONT_END_DOMAIN}/reset-password?token=${token}&email=${email}`;

            const mailerConfig: MailOptions = {
                to: email,
                from: 'Intra127',
                template: 'auth/forgot_password',
                context: { linkToFollow },
            } as MailOptions;

            await transport.sendMail(mailerConfig);

            return true;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async validatePasswordResetToken({
        email,
        token,
    }: validatePasswordResetTokenRequest): Promise<User | ErrorWithStats> {
        try {
            //Searching user by email, and passwordResetToken
            const user = await userRepository.findOne({
                where: { email, password_reset_token: token },
                select: [
                    'id',
                    'email',
                    'created_at',
                    'permission',
                    'updated_at',
                    'updated_at',
                    'userName',
                    'password_reset_token',
                    'password_reset_expires',
                ],
            });

            if (!user) return new ErrorWithStats("You do not have valid data to change this user's password", 401);

            //Checking if the token is expired
            const now = new Date();
            if (now > user.password_reset_expires) return new ErrorWithStats('This token is expired', 401);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
