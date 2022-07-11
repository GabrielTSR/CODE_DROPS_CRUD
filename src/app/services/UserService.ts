import { ErrorWithStats } from '../model/ErrorWithStats';
import { User } from '../entity/User';

import { userRepository } from '../entity/repositorys/repositorys';
import { isEmailValid } from '../validation/isEmailValid';
import { isPasswordValid } from '../validation/isPasswordValid';

type createUserRequest = {
    email: string;
    password: string;
    userName: string;
};

type validateDataParams = {
    email: string;
    password: string;
    userName: string;
    isCreation: boolean;
};

export class UserService {
    async validateData({
        email,
        password,
        userName,
        isCreation,
    }: validateDataParams): Promise<[string, number] | void> {
        try {
            if (!email && isCreation) return ['Email is empty', 400];
            if (!password && isCreation) return ['Password is too empty', 400];

            if (email) {
                if (!isEmailValid(email)) return ['Email is invalid', 400];
                if (await userRepository.findOne({ where: { email } })) return ['This email is already in use', 409];
            }

            if (password) {
                if (!isPasswordValid(password)) return ['Password is invalid', 400];
            }

            if (!userName && isCreation) return ['User name is empty', 400];
            if (userName) {
                if (!userName.length && isCreation) return ['User name size is invalid', 400];
                if (userName.length > 50) return ['User name is too long, the maximum is 50 characters', 400];
            }
        } catch (error) {
            return [error.message, 400];
        }
    }

    async createUser({ email, password, userName }: createUserRequest): Promise<User | ErrorWithStats> {
        try {
            const validation = await this.validateData({ email, password, userName, isCreation: true });
            if (validation) {
                return new ErrorWithStats(validation[0], validation[1]);
            }

            const user = userRepository.create({ email, password, userName });
            await userRepository.save(user);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async updateUser({ id, userName, email, password }: User) {
        try {
            const validation = await this.validateData({ userName, email, password, isCreation: false });
            if (validation) {
                return new ErrorWithStats(validation[0], validation[1]);
            }

            const user = await userRepository.findOne({ where: { id } });

            if (!user) {
                return new ErrorWithStats('User does not exists!', 404);
            }

            user.userName = userName ? userName : user.userName;
            user.email = email ? email : user.email;
            user.password = password ? password : user.password;

            await userRepository.save(user);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async deleteResetPasswordToken(id: number) {
        try {
            const user = await userRepository.findOne({ where: { id } });

            if (!user) {
                return new ErrorWithStats('User does not exists!', 404);
            }

            user.password_reset_token = null;
            user.password_reset_expires = null;

            await userRepository.save(user);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
