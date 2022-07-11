import { TokenService } from './../services/TokenService';
import { ErrorWithStats } from '../model/ErrorWithStats';
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

const authService = new AuthService();
const tokenService = new TokenService();
const userService = new UserService();

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.authenticate({ email, password });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token in the database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    return res.json(result);
}

export async function refresh(req: Request, res: Response) {
    const { authorization } = req.headers;

    const result = await authService.refresh({ token: authorization });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token in the database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    return res.json(result);
}

export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const userWithToken = await authService.crateResetToken({ email });

    if (userWithToken instanceof ErrorWithStats) {
        return res.status(userWithToken.status).json({ error: { message: userWithToken.message } });
    }

    const emailSent = await authService.sendPasswordRecoveryEmail({
        email: userWithToken.email,
        token: userWithToken.password_reset_token,
    });

    if (emailSent instanceof ErrorWithStats) {
        return res.status(emailSent.status).json({ error: { message: emailSent.message } });
    }

    return res.send({ message: 'Email sent' });
}

export async function validatePasswordResetToken(req: Request, res: Response) {
    const { email, token } = req.query;

    //@ts-ignore
    const user = await authService.validatePasswordResetToken({ email, token });

    if (user instanceof ErrorWithStats) {
        return res.status(user.status).json({ error: { message: user.message } });
    }

    return res.json(user);
}

export async function resetPassword(req: Request, res: Response) {
    const { email, token, password } = req.body;

    //@ts-ignore
    const validUser = await authService.validatePasswordResetToken({ email, token });

    if (validUser instanceof ErrorWithStats) {
        return res.status(validUser.status).json({ error: { message: validUser.message } });
    }

    await userService.deleteResetPasswordToken(validUser.id);

    validUser.password = password;
    validUser.email = null;
    const result = await userService.updateUser(validUser);

    return res.json(result);
}
