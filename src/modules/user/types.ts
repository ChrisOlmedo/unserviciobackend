import { Document } from "mongoose";


// Interfaz de usuario (sin Document)
export interface IUser {
    userId: String;
    name: string;
    email: string;
    role?: "user" | "service-provider";
}

// Interfaz para documentos de MongoDB
export interface IUserDocument extends IUser, Document { }