import { TokenService } from './../services/TokenService';
import { ErrorWithStats } from '../model/ErrorWithStats';
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

//Instantiating the services used
const authService = new AuthService();
const tokenService = new TokenService();
const userService = new UserService();

//This function is used to login a user with the given credentials
export async function authenticate(req: Request, res: Response) {
    //Getting the credentials from the request body
    const { user: email, password } = req.body;

    //Using the AuthService to authenticate the user
    const result = await authService.authenticate({ email, password });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token to database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    //Returning the token to the user
    return res.json(result);
}

//This function is used to get the logged user
export async function getLoggedUser(req: Request, res: Response) {
    //Returning the user from res
    return res.json(req.user);
}

//This function is used to persist user session, refreshing the token
export async function refresh(req: Request, res: Response) {
    //Getting the token from the request headers
    const { authorization } = req.headers;

    //Using the TokenService to refresh the token
    const result = await authService.refresh({ token: authorization });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token to database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    //Returning the token to the user
    return res.json(result);
}

//This function is used recover the password of a user
export async function forgotPassword(req: Request, res: Response) {
    //Getting the data from the request body
    const { email } = req.body;

    //Using the AuthService to create a new password reset token
    const userWithToken = await authService.crateResetToken({ email });

    //If an error occurred, return it
    if (userWithToken instanceof ErrorWithStats) {
        return res.status(userWithToken.status).json({ error: { message: userWithToken.message } });
    }

    //Sending the email with the token to the user
    const emailSent = await authService.sendPasswordRecoveryEmail({
        firstName: userWithToken.userName,
        email,
        token: userWithToken.password_reset_token,
    });

    //If an error occurred, return it
    if (emailSent instanceof ErrorWithStats) {
        return res.status(emailSent.status).json({ error: { message: emailSent.message } });
    }

    //Returning the e-mail sent message
    return res.send({ message: 'Email sent' });
}

//This function is used check if the data used to recover the password is valid
export async function validatePasswordResetToken(req: Request, res: Response) {
    //Getting the data from the request body
    const { email, token } = req.query;

    //Using the AuthService to check if the data is valid
    const user = await authService.validatePasswordResetToken({ email: String(email), token: String(token) });

    //If an error occurred, return it
    if (user instanceof ErrorWithStats) {
        return res.status(user.status).json({ error: { message: user.message } });
    }

    //Returning the user
    return res.json(user);
}

//This function is used to change the password of a user, with a valid password reset token
export async function resetPassword(req: Request, res: Response) {
    //Getting the data from the request body
    const { email, token, password } = req.body;

    //Using the AuthService to check if the data is valid
    const validUser = await authService.validatePasswordResetToken({ email, token });

    //If an error occurred, return it
    if (validUser instanceof ErrorWithStats) {
        return res.status(validUser.status).json({ error: { message: validUser.message } });
    }

    //Using the UserService to clear the password reset token
    await userService.deleteResetPasswordToken(validUser.id);

    //Using the UserService to change the password
    validUser.password = password;
    validUser.email = null;
    const result = await userService.updateUser(validUser);

    //Returning the result
    return res.json(result);
}
