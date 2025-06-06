import mongoose, { Schema } from 'mongoose';
import { IImage } from '@shared/types/image.types';

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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Opcional si no siempre se usa
    }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_, ret) => {
                ret.id = ret._id.toString(); // convierte _id a id
                delete ret._id;              // elimina _id original
            },
        },
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: (_, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
            }

        }
    }
);

export default mongoose.model<IImage>('Image', ImageSchema);
