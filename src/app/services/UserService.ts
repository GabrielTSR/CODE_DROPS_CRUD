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

export class UserService {
    async validateDataToCreation({ email, password, userName }: createUserRequest): Promise<[string, number] | void> {
        if (!email) return ['Email is empty', 400];
        if (!password) return ['Password is too empty', 400];

        if (!isEmailValid(email)) return ['Email is invalid', 400];
        if (!isPasswordValid(password)) return ['Password is invalid', 400];

        if (!userName) return ['User name is empty', 400];
        if (!userName.length) return ['User name size is invalid', 400];
        if (userName.length > 50) return ['User name is too long, the maximum is 50 characters', 400];

        if (await userRepository.findOne({ where: { email } })) return ['This email is already in use', 409];
    }

    async createUser({ email, password, userName }: createUserRequest): Promise<User | ErrorWithStats> {
        try {
            const validation = await this.validateDataToCreation({ email, password, userName });
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
}
