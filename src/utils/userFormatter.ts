import { IUser, IUserDocument } from '../models/userModel';



interface userFormatted {
    id: String;
    user: {
        name: String;
        email: String;
        role: 'user' | 'serviceprovider' | undefined;
    } | null;
}
const userFormatter = (user: IUserDocument | IUser): userFormatted => {
    if (!user.userId) {
        console.error('El usuario no tiene un ID');
    }
    return {
        id: user.userId,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

export default userFormatter;