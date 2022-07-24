import { ValidationError } from '../Types/ValidationError';

type ValidateDataFunctionArgs = {
    email: string;
    password: string;
};

//This method is used to validate the data used to create or update an authentication
export async function AuthValidation({ email, password }: ValidateDataFunctionArgs): Promise<ValidationError | void> {
    try {
        if (!email) return ['Email is empty', 400];
        if (!password) return ['Password is empty', 400];
    } catch (error) {
        return [error.message, 400];
    }
}
