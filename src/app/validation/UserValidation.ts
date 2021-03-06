import { userRepository } from '../entity/repositories/repositories';
import { ValidationError } from '../Types/ValidationError';
import { isEmailValid } from '../utils/validation/isEmailValid';
import { isPasswordValid } from '../utils/validation/isPasswordValid';

type EntityObj = {
    email?: string;
    password?: string;
    userName?: string;
    birthDate?: Date;
};

type ValidateDataFunctionArgs = {
    entityObj: EntityObj;
    intention: 'post' | 'put' | 'patch' | 'delete';
};

//This method is used to validate the data used to create or update an user
export async function UserValidation({
    entityObj,
    intention,
}: ValidateDataFunctionArgs): Promise<ValidationError | void> {
    try {
        //Desestructuring the entityObj
        const { email, password, userName, birthDate } = entityObj;

        //Exclusive validation for the creation case
        if (intention === 'post') {
            if (!email) return ['Email is empty', 422];
            if (!password) return ['Password is empty', 422];
            if (!userName) return ['User name is empty', 422];
            if (!birthDate) return ['Birth date is empty', 422];
        }

        if (email) {
            if (!isEmailValid(email)) return ['Email is invalid', 400];
            if (await userRepository.findOne({ where: { email } })) return ['This email is already in use', 409];
        }

        if (password) {
            if (!isPasswordValid(password)) return ['Password is invalid', 400];
        }

        if (userName) {
            if (!userName.length) return ['User name size is invalid', 400];
            if (userName.length > 50) return ['User name is too long, the maximum is 50 characters', 400];
        }

        if (birthDate) {
            if (birthDate.getTime() > new Date().getTime()) return ['Birth date is invalid', 400];
        }
    } catch (error) {
        return [error.message, 400];
    }
}
