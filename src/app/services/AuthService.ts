import { compare } from 'bcryptjs';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { tokenRepository, userRepository } from '../entity/repositories/repositories';
import { User } from '../entity/User';
import { ErrorWithStats } from '../model/ErrorWithStats';
import transport from '../modules/mailer';
import { ValidationError } from '../Types/ValidationError';
import { aleatoryString } from '../utils/aleatoryString';
import { removeBearer, signHash, verifyToken } from '../utils/tokenProvider';

//Defining all types used
type validateDataParams = {
    email: string;
    password: string;
};

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
    firstName: string;
    token: string;
    email: string;
};

type validatePasswordResetTokenRequest = {
    email: string;
    token: string;
};

//Class used to handle the authentication service
export class AuthService {
    //This method is used to validate the data used to create or update an authentication
    private async validateData({ email, password }: validateDataParams): Promise<ValidationError | void> {
        try {
            if (!email) return ['Email is empty', 400];
            if (!password) return ['Password is empty', 400];
        } catch (error) {
            return [error.message, 400];
        }
    }

    //This method is used to authenticate a user
    async authenticate({ email, password }: authenticationRequest): Promise<authenticationResponse | ErrorWithStats> {
        try {
            //Checking if the incoming data is valid
            const isValidationInvalid = await this.validateData({ email, password });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Searching user by email
            const user = await userRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'created_at', 'updated_at', 'updated_at', 'userName'],
                relations: ['role'],
            });

            //If the user is not found, return an error
            if (!user) return new ErrorWithStats('The email or password is incorrect', 401);

            //Checking if the password is correct
            const isValidPassword = await compare(password, user.password);

            //If the password is incorrect, return an error
            if (!isValidPassword) return new ErrorWithStats('The email or password is incorrect', 401);

            //Removing the password from the user object
            delete user.password;

            //Creating a token, that expires in 1 hour
            const tokens = signHash({ user, expiresIn: '1h' });

            //Returning the user and the token
            return { user, token: tokens.bearer };
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to refresh the token
    async refresh({ token }: refreshRequest): Promise<refreshResponse | ErrorWithStats> {
        try {
            //Verifying if is a valid token
            const validToken = await tokenRepository.findOne({
                where: { hash: removeBearer({ token }) },
                relations: ['user'],
            });

            //If the token is not valid, return an error
            if (!validToken) return new ErrorWithStats('This token is invalid', 401);

            //Creating a token, that expires in 1 hour
            const tokens = signHash({ user: validToken.user, expiresIn: '1h' });

            //Returning the user and the token
            return { user: validToken.user, token: tokens.bearer };
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to create a password reset token to the user
    async crateResetToken({ email }: forgotPasswordRequest): Promise<User | ErrorWithStats> {
        try {
            //Searching user by email
            const user = await userRepository.findOne({
                where: { email },
            });

            //If the user is not found, return an error
            if (!user) return new ErrorWithStats('There is no an user with this email', 404);

            //Raising a token to the user, which is a random string of 90 characters
            const token = aleatoryString(90);

            //Instantiating the token expiration time, which is one hour
            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1);

            //Updating the instance of user with the new token and the expiration time
            user.password_reset_expires = expirationTime;
            user.password_reset_token = token;

            //Saving the instance of user to database
            await userRepository.save(user);

            //Returning the user
            return user;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to send an e-mail to the user with the password reset token
    async sendPasswordRecoveryEmail({
        firstName,
        email,
        token,
    }: sendPasswordRecoveryEmailRequest): Promise<boolean | ErrorWithStats> {
        try {
            //In the e-mail, the user will receive a link to change his password
            const linkToFollow = `${process.env.FRONT_END_DOMAIN}/reset-password?token=${token}&email=${email}`;

            //Creating the e-mail
            const mailerConfig: MailOptions = {
                to: email,
                from: 'Intra127',
                template: 'auth/forgot_password',
                context: { linkToFollow, firstName },
            } as MailOptions;

            //Sending the e-mail
            await transport.sendMail(mailerConfig);

            //Returning true
            return true;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to validate the password reset token
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
                    'role',
                    'updated_at',
                    'updated_at',
                    'userName',
                    'password_reset_token',
                    'password_reset_expires',
                ],
            });

            //If the user is not found, return an error
            if (!user) return new ErrorWithStats("You do not have valid data to change this user's password", 401);

            //Checking if the token is expired
            const now = new Date();
            if (now > user.password_reset_expires) return new ErrorWithStats('This token is expired', 401);

            //Returning the user
            return user;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
