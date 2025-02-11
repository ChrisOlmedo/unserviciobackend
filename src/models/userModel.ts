import mongoose, { Schema } from 'mongoose';

// Definir un esquema
export interface IUser {
    id: string;
    name: string;
    email: string;
    role?: 'user' | 'serviceprovider';
}

const UsersSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'serviceprovider'],
        default: 'user',
    },
});

// Crear un modelo
const User = mongoose.model('Users', UsersSchema);

export default User;
