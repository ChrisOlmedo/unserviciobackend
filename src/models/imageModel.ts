import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
    serviceProviderId: mongoose.Types.ObjectId;
    type: 'logo' | 'gallery';
    url: string;
    public_id: string;
    ownerId?: mongoose.Types.ObjectId; // Opcional si se usa en otros contextos
}

const ImageSchema = new Schema<IImage>({
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true,
    },
    type: {
        type: String,
        enum: ['logo', 'gallery'],
        required: true,
    },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Opcional si no siempre se usa
    }
},
    { timestamps: true }
);

export default mongoose.model<IImage>('Image', ImageSchema);
