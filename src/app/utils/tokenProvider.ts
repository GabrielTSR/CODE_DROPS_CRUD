import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { User } from '../entity/User';

//Defining all types used
type removeBearerParams = {
    token: string;
};

type incrementBearerParams = {
    hash: string;
};

type signParams = {
    user: User;
    expiresIn: string;
};
type signReturn = {
    hash: string;
    bearer: string;
};

type verifyParams = {
    token: string;
};

//This function is used to remove the Bearer from the token
function removeBearer({ token }: removeBearerParams): string {
    return token.replace('Bearer', '').trim();
}

//This function is used to increment the Bearer in the token
function incrementBearer({ hash }: incrementBearerParams): string {
    //Incrementing the Bearer in the token
    return `Bearer ${hash}`;
}

//This function is used to create a token with the user
function signHash({ user, expiresIn }: signParams): signReturn {
    //Creating a token, that expires in 1 hour
    const hash = sign({ user }, process.env.JWT_SECRET, { expiresIn });
    const bearer = incrementBearer({ hash });

    return { hash, bearer };
}

//This function is used to verify a token based on the secret
function verifyToken({ token }: verifyParams): string | JwtPayload {
    //Verifying if is a valid token
    return verify(token, process.env.JWT_SECRET);
}

//Exporting all functions
export { removeBearer, incrementBearer, signHash, verifyToken };
