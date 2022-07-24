import { ErrorWithStats } from '../model/ErrorWithStats';
import { User } from '../entity/User';

import { userRepository } from '../entity/repositories/repositories';
import { UserValidation } from '../validation/UserValidation';

//Defining all types used
type createUserRequest = {
    email: string;
    password: string;
    userName: string;
};

//Class used to handle the user service
export class UserService {
    //This method is used to create a new user
    async createUser(userObj: createUserRequest): Promise<User | ErrorWithStats> {
        try {
            //Checking if the incoming data is valid
            const isValidationInvalid = await UserValidation({
                entityObj: userObj,
                intention: 'post',
            });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Creating an user instance
            const user = userRepository.create(userObj);

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
    async updateUser(userObj: User) {
        try {
            //Checking if the used data is valid
            const isValidationInvalid = await UserValidation({ entityObj: userObj, intention: 'patch' });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Finding the user to update
            const user = await userRepository.findOne({ where: { id: userObj.id } });

            //If the user does not exists, return error
            if (!user) {
                return new ErrorWithStats('User does not exists!', 404);
            }

            //Updating the user with the incoming data
            userObj = userRepository.merge(user, userObj);

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
