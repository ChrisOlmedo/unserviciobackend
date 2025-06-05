import mongoose, { Document } from "mongoose";
export * from "@modules/service-provider/types";
export * from "@modules/user/types";
export * from "./image.types";
export type imageType = 'logo' | 'gallery';

export interface IImage extends Document {
    serviceProviderId: mongoose.Types.ObjectId;
    type: imageType;
    url: string;
    public_id: string;
    userId?: mongoose.Types.ObjectId; // Opcional si se usa en otros contextos
}

