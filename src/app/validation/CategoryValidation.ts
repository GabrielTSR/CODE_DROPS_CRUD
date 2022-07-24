import { categoryRepository } from '../entity/repositories/repositories';
import { ValidationError } from '../Types/ValidationError';

//Defining all types used
type EntityObj = {
    description?: string;
    name?: string;
    id?: number;
};

type ValidateDataFunctionArgs = {
    entityObj: EntityObj;
    intention: 'post' | 'put' | 'patch' | 'delete';
};

export async function CategoryValidation({
    entityObj,
    intention,
}: ValidateDataFunctionArgs): Promise<ValidationError | void> {
    try {
        //Desestructuring the entityObj
        const { name, description } = entityObj;

        //If the intention is to post
        if (intention === 'post' || intention === 'put') {
            //The name must be provided
            if (!name) return ['Name is required!', 422];

            //The description must be provided
            if (!description) return ['Description is required!', 422];

            //Checking if the category already exists, if it does, return an error
            if (await categoryRepository.findOne({ where: { name } })) return ['Category already exists', 409];
        }

        //General validation
        if (name && name.length > 50) return ['Name must be less than 50 characters!', 400];
        if (description && description.length > 65535) return ['Description must be less than 65535 characters!', 400];
    } catch (error) {
        return [error.message, 400];
    }
}
