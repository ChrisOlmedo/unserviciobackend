import User, { IUser } from '../models/userModel';

export async function createUser(userData: IUser): Promise<IUser | null> {
    const user = await User.create(userData);
    console.log('Usuario creado:', user);
    const userObj = getUser({ id: user.id });
    return userObj // Convierte el documento a objeto plano y tipa correctamente
}

export async function getUser(filter: Record<string, any>): Promise<IUser | null> {
    return await User.findOne(filter).select("-_id -__v");
}