import { IUser, IUserDocument } from '../models/userModel';

export interface UserFormatted {
    user: Pick<IUser, 'name' | 'email' | 'role'>;
}

const userFormatter = (user: IUserDocument | IUser): UserFormatted => {
    return {
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export default userFormatter;
