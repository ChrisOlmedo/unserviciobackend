import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz de usuario (sin Document)
export interface IUser {
    userId: String;
    name: string;
    email: string;
    role?: "user" | "serviceprovider";
}

// Interfaz para documentos de MongoDB
export interface IUserDocument extends IUser, Document { }

// Definir el esquema de Mongoose
const UsersSchema: Schema<IUserDocument> = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: ["user", "serviceprovider"],
            default: "user",
        },
    },
    { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Crear el modelo tipado correctamente
const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>(
    "User",
    UsersSchema
);

export default UserModel;
