import { ErrorWithStats } from '../model/ErrorWithStats';
import { User } from '../entity/User';

import { userRepository } from '../entity/repositories/repositories';
import { isEmailValid } from '../validation/isEmailValid';
import { isPasswordValid } from '../validation/isPasswordValid';
import { ValidationError } from '../Types/ValidationError';

//Defining all types used
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

//Class used to handle the user service
export class UserService {
    //This method is used to validate the data used to create or update an user
    async validateData({ email, password, userName, isCreation }: validateDataParams): Promise<ValidationError | void> {
        try {
            //Exclusive validation for the creation case
            if (isCreation) {
                if (!email) return ['Email is empty', 400];
                if (!password) return ['Password is empty', 400];
                if (!userName) return ['User name is empty', 400];
            }

            if (email) {
                if (!isEmailValid(email)) return ['Email is invalid', 400];
                if (await userRepository.findOne({ where: { email } })) return ['This email is already in use', 409];
            }

            if (password) {
                if (!isPasswordValid(password)) return ['Password is invalid', 400];
            }

            if (userName) {
                if (!userName.length && isCreation) return ['User name size is invalid', 400];
                if (userName.length > 50) return ['User name is too long, the maximum is 50 characters', 400];
            }
        } catch (error) {
            return [error.message, 400];
        }
    }

    //This method is used to create a new user
    async createUser({ email, password, userName }: createUserRequest): Promise<User | ErrorWithStats> {
        try {
            //Checking if the incoming data is valid
            const isValidationInvalid = await this.validateData({ email, password, userName, isCreation: true });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Creating an user instance
            const user = userRepository.create({ email, password, userName });

            //Saving the user in database
            await userRepository.insert(user);

            //Returning the user
            return user;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to update an user
    async updateUser({ id, userName, email, password }: User) {
        try {
            //Checking if the used data is valid
            const isValidationInvalid = await this.validateData({ userName, email, password, isCreation: false });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Finding the user to update
            const user = await userRepository.findOne({ where: { id } });

            //If the user does not exists, return error
            if (!user) {
                return new ErrorWithStats('User does not exists!', 404);
            }

            //Updating the user with the incoming data
            user.userName = userName ? userName : user.userName;
            user.email = email ? email : user.email;
            user.password = password ? password : user.password;

            //Saving the user in database
            await userRepository.save(user);

            //Returning the user
            return user;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to set the an user password reset token as null
    async deleteResetPasswordToken(id: number) {
        try {
            //Finding the user to update
            const user = await userRepository.findOne({ where: { id } });

            //If the user does not exists, return error
            if (!user) {
                return new ErrorWithStats('User does not exists!', 404);
            }

            //Settinh the password reset token to null
            user.password_reset_token = null;
            user.password_reset_expires = null;

            //Saving the user in database
            await userRepository.save(user);

            //Returning the user
            return user;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
