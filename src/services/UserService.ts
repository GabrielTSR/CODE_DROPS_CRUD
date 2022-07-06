import { ErrorWithStats } from '../app/model/ErrorWithStats';
import { User } from './../app/entity/User';

import { userRepository } from '../app/entity/repositorys/repositorys';
import { isEmailValid } from '../app/validation/isEmailValid';
import { isPasswordValid } from '../app/validation/isPasswordValid';

type createUserRequest = {
    email: string;
    password: string;
};

export class UserService {
    async validateDataToCreation({ email, password }: createUserRequest): Promise<[string, number] | void> {
        if (!email) return ['Email is empty', 400];
        if (!password) return ['Password is too empty', 400];
        if (!isEmailValid(email)) return ['Email is invalid', 400];
        if (!isPasswordValid(password)) return ['Password is invalid', 400];

        if (await userRepository.findOne({ where: { email } })) return ['This email is already in use', 409];
    }

    async createUser({ email, password }: createUserRequest): Promise<User | ErrorWithStats> {
        try {
            const validation = await this.validateDataToCreation({ email, password });
            if (validation) {
                return new ErrorWithStats(validation[0], validation[1]);
            }

            const user = userRepository.create({ email, password });
            await userRepository.save(user);

            return user;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
