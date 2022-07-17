import { tokenRepository } from '../entity/repositories/repositories';
import { ErrorWithStats } from '../model/ErrorWithStats';
import { removeBearer } from '../utils/tokenProvider';

//Defining all types used
type saveTokenParams = {
    hash: string;
    idUser: number;
};

////Class used to handle the token service
export class TokenService {
    //This method is used to save a token
    async save({ hash, idUser }: saveTokenParams) {
        try {
            //Creating a token with no Bearer in the hash
            const cleanHash = removeBearer({ token: hash });

            //Finding the token that is related to the user, and if it not exists, create a new one
            let token = await tokenRepository.findOne({ where: { idUser } });
            if (!token) {
                token = await tokenRepository.create({ hash: cleanHash, idUser: idUser });
            }

            //Saving the token in token instance
            token.hash = cleanHash;

            //Saving the token to database
            await tokenRepository.save(token);

            //Returning the token
            return token;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
