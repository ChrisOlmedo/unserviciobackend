import mongoose, { Schema } from 'mongoose';

// Definir un esquema
export interface IUser {
    id: string;
    name: string;
    email: string;
}

const UsersSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
});

// Crear un modelo
const User = mongoose.model<IUser>('Users', UsersSchema);

export default User;
