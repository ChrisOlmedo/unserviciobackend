import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type imageType = 'logo' | 'gallery';

export interface CloudinaryImage {
    url: string;
    public_id: string;
}
export interface IImage extends Document, CloudinaryImage {
    _id: Types.ObjectId;
    serviceProviderId: mongoose.Types.ObjectId;
    type: imageType;
    userId?: mongoose.Types.ObjectId; // Opcional si se usa en otros contextos
}
