import { ErrorWithStats } from '../../model/ErrorWithStats';
import { Repository } from 'typeorm';
import { ValidationError } from '../../Types/ValidationError';

//Defining all types used
type ValidateDataFunctionArgs = {
    entityObj: any;
    intention: 'post' | 'put' | 'patch';
};

type ValidateDataFunction = (args: ValidateDataFunctionArgs) => Promise<ValidationError | void>;

type BaseServiceConstructorArgs<T> = {
    validateDataFunction?: ValidateDataFunction;

    entity: {
        primaryKey?: string;
        repository: Repository<T>;
        name: string;
    };
};

type CreateEntityRequest = {
    entityObj: any;
};

type updateEntityRequest = {
    id: number;
    entityObj: any;
    intention: 'put' | 'patch';
};

//Class used to handle the entity service, if the user only needs a generic CRUD of a certain entity, this service can serve
export class BaseService<T> {
    //This service needs to know the repository to use
    constructor({ validateDataFunction, entity: { primaryKey, repository, name } }: BaseServiceConstructorArgs<T>) {
        //Getting the repository for the entity
        //@ts-ignore
        this.entityRepository = repository;

        //If a validate data function is provided, use it, else, use a function that does not have any validation
        this.validateDataFunction = validateDataFunction ? validateDataFunction : () => Promise.resolve();

        //If a primary key is provided, set it, otherwise use the default
        this.primaryKey = primaryKey ? primaryKey : 'id';

        //Setting the entity name
        this.entityName = name;
    }

    private entityRepository: Repository<T>;
    private primaryKey: string;
    private entityName: string;
    private validateDataFunction: ValidateDataFunction;

    //This method is used to get all entities
    async getAllEntities() {
        try {
            //Collecting all entities
            const entities = await this.entityRepository.find();

            //If there are no entities, return an error
            if (entities.length < 1) return new ErrorWithStats(`${this.entityName} not found!`, 404);

            //Returning all entities
            return entities;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 500);
        }
    }

    //This method is used to get a entity by id
    async getEntityById(id: number) {
        try {
            //Checking if the entity exists
            let entity = await this.entityRepository.findOne({
                //@ts-ignore
                where: { [this.primaryKey]: id },
            });

            //If the entity does not exist, return an error
            if (!entity) {
                return new ErrorWithStats(`${this.entityName} does not exists!`, 404);
            }

            //Returning the entity
            return entity;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to create a new entity
    async createEntity({ entityObj }: CreateEntityRequest): Promise<T | ErrorWithStats> {
        try {
            //Checking if the incoming data is valid
            const isValidationInvalid = await this.validateDataFunction({ entityObj, intention: 'post' });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //Creating the entity object
            const entity = this.entityRepository.create(entityObj);

            //Saving the entity
            await this.entityRepository.save(entity);

            //Returning the entity
            //@ts-ignore
            return entity;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to change an attribute of an entity
    async updateEntity({ entityObj, intention, id }: updateEntityRequest): Promise<T | ErrorWithStats> {
        try {
            //Checking if the entity exists
            let entity = await this.entityRepository.findOne({
                //@ts-ignore
                where: { [this.primaryKey]: id },
            });

            //Checking if the incoming data is valid
            const isValidationInvalid = await this.validateDataFunction({ entityObj, intention });

            //If the validation is invalid, return error
            if (isValidationInvalid) {
                return new ErrorWithStats(isValidationInvalid[0], isValidationInvalid[1]);
            }

            //If the entity does not exist, return an error
            if (!entity) {
                return new ErrorWithStats(`${this.entityName}  does not exists!`, 404);
            }

            if (intention === 'patch') {
                //Updating the entity with the data that was sent
                entityObj = this.entityRepository.merge(entity, entityObj);
            }

            //Saving the entity
            await this.entityRepository.save(entityObj);

            //Returning the entity
            return entityObj;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to delete a entity
    async deleteEntity(id: number) {
        try {
            //Checking if the entity exists
            let entity = await this.entityRepository.findOne({
                //@ts-ignore
                where: { [this.primaryKey]: id },
            });

            //If the entity does not exist, return an error
            if (!entity) {
                return new ErrorWithStats(`${this.entityName} does not exists!`, 404);
            }

            //Deleting the entity
            await this.entityRepository.delete(id);
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
