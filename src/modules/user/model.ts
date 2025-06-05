import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument } from "./types";

// Definir el esquema de Mongoose
const UsersSchema: Schema<IUserDocument> = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: ["user", "service-provider"],
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
