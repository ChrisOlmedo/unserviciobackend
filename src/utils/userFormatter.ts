import { IUser } from '../models/userModel';


interface IUserFormat extends IUser {
    _id?: string;
    __v?: number;
}
interface userFormatted {
    id: string;
    user: {
        name: string;
        email: string;
        role: 'user' | 'serviceprovider' | undefined;
    } | null;
}
const userFormatter = (user: IUserFormat): userFormatted => {
    return {
        id: user.id,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

export default userFormatter;