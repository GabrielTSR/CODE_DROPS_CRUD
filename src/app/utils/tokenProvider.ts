import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { User } from '../entity/User';

type removeBearerParams = {
    token: string;
};

type incrementBearerParams = {
    hash: string;
};

type signParams = {
    user: User;
};
type signReturn = {
    hash: string;
    bearer: string;
};

type verifyParams = {
    token: string;
};

function removeBearer({ token }: removeBearerParams): string {
    return token.replace('Bearer', '').trim();
}

function incrementBearer({ hash }: incrementBearerParams): string {
    return `Bearer ${hash}`;
}

function signHash({ user }: signParams): signReturn {
    //Creating a token, that expires in 1 hour
    const hash = sign({ user }, process.env.JWT_SECRET, { expiresIn: '0.0000000001h' });
    const bearer = incrementBearer({ hash });

    return { hash, bearer };
}

function verifyToken({ token }: verifyParams): string | JwtPayload {
    return verify(token, process.env.JWT_SECRET);
}

export { removeBearer, incrementBearer, signHash, verifyToken };
