import User from '../model';
import { IUser } from '../types';
import { ClientSession, Types } from 'mongoose';

export async function createUser(userData: IUser) {
    const user = await User.create(userData);
    console.log('Usuario creado:', user);
    return user;
}

export async function getUser(filter: Record<string, any>) {
    return await User.findOne(filter);
}

export async function updateRoleToServiceProvider(
    userId: string | Types.ObjectId,
    session?: ClientSession | null) {
    return User.findByIdAndUpdate(
        userId,
        { role: "service-provider" },
        { new: true, session } // ← ¡Mantiene la transacción!
    );
}

/*
export async function getUserById(userId: string) {
    return await User.findById(userId).select("-_id -__v");
}*/