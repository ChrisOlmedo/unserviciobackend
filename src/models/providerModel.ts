import mongoose, { Schema, Document } from "mongoose";

// Interfaz para TypeScript
export interface IProvider extends Document {
    userId: mongoose.Types.ObjectId; // Referencia al usuario creador
    enterpriseName: string;
    phone: string;
    typeService: string;
    location: string;
    rating: number;
    logo: string;
    slug: string;
    providerPageData: {
        services: string[];
        aboutMe: string;
        gallery: { url: string }[];
    };
}

// Definimos el esquema
const ProviderSchema = new Schema<IProvider>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Relación con el usuario
        slug: { type: String, required: true, unique: true },
        enterpriseName: { type: String, required: true },
        logo: { type: String, required: true },
        typeService: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        providerPageData: {
            services: [{ type: String, required: true }],
            aboutMe: { type: String, required: true },
            gallery: [{ url: { type: String, required: true } }],
        },
    },
    { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Exportamos el modelo
const Provider = mongoose.model<IProvider>("Provider", ProviderSchema);
export default Provider;
