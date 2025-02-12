import User, { IUser } from '../models/userModel';

export async function createUser(userData: IUser) {
    const user = await User.create(userData);
    console.log('Usuario creado:', user);
    return user;
}

export async function getUser(filter: Record<string, any>) {
    return await User.findOne(filter);
}
/*
export async function getUserById(userId: string) {
    return await User.findById(userId).select("-_id -__v");
}*/