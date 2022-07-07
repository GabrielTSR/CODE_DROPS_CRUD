import { User } from '../../app/entity/User';

declare global {
    declare namespace Express {
        export interface Request {
            user: User;
        }
    }
}
