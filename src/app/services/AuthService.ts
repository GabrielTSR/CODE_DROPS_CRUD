import { compare } from 'bcryptjs';
import { tokenRepository, userRepository } from '../entity/repositorys/repositorys';
import { User } from '../entity/User';
import { ErrorWithStats } from '../model/ErrorWithStats';
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
}
