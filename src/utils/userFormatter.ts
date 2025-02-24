import { IUser, IUserDocument } from '../models/userModel';



interface userFormatted {
    user: {
        name: string;
        email: string;
        role: 'user' | 'serviceprovider' | undefined;
    } | null;
}
const userFormatter = (user: IUserDocument | IUser): userFormatted => {

    return {
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

export default userFormatter;