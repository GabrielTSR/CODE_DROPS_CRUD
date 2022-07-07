import { tokenRepository } from '../entity/repositorys/repositorys';
import { ErrorWithStats } from '../model/ErrorWithStats';
import { removeBearer } from '../utils/tokenProvider';

type saveTokenParams = {
    hash: string;
    idUser: number;
};

export class TokenService {
    async save({ hash, idUser }: saveTokenParams) {
        try {
            const cleanHash = removeBearer({ token: hash });

            let token = await tokenRepository.findOne({ where: { idUser } });
            if (!token) {
                token = await tokenRepository.create({ hash: cleanHash, idUser: idUser });
            }

            token.hash = cleanHash;

            return tokenRepository.save(token);
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
