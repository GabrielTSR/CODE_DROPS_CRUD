import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { userRepository } from '../app/entity/repositorys/repositorys';
import { User } from '../app/entity/User';
import { ErrorWithStats } from '../app/model/ErrorWithStats';

type authenticationRequest = {
    email: string;
    password: string;
};

type authenticationResponse = {
    token: string;
    user: User;
};

export class AuthService {
    async authenticate({ email, password }: authenticationRequest): Promise<authenticationResponse | ErrorWithStats> {
        try {
            const user = await userRepository.findOne({ where: { email }, select: ['id', 'email', 'password'] });

            if (!user) return new ErrorWithStats('The email or password is incorrect', 401);

            const isValidPassword = await compare(password, user.password);

            if (!isValidPassword) return new ErrorWithStats('The email or password is incorrect', 401);

            //Creating a token
            const token = `Bearer  ${sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

            delete user.password;

            return { user, token };
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
