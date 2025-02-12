import mongoose, { Schema, Document } from "mongoose";

// Interfaz para TypeScript
interface IReview extends Document {
    provider: mongoose.Types.ObjectId; // Referencia al proveedor
    user: mongoose.Types.ObjectId; // Usuario que hizo la review
    comment: string;
    rating: number;
    createdAt: Date;
}

// Definimos el esquema
const ReviewSchema = new Schema<IReview>(
    {
        provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Exportamos el modelo
const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
