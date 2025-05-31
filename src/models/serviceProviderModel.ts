import mongoose, { Schema, Document } from "mongoose";

export interface IServiceProvider extends Document {
    userId: mongoose.Types.ObjectId;
    slug: string;
    enterpriseName: string;
    logo: { url: string, public_id: string };
    serviceCategories: string[];
    rating: number;
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
    coverage: {
        maxDistance: number;
        cities: string[];
    };
    services: string[];
    aboutMe: string;
    gallery: { id: mongoose.Types.ObjectId, url: string, public_id: string }[];
}
const ImageSchema = new Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
});

const ServiceProviderSchema = new Schema<IServiceProvider>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        slug: { type: String, required: true, unique: true },

        enterpriseName: { type: String, required: true },

        logo: { type: ImageSchema, required: true },

        serviceCategories: [{ type: String, required: true }],

        rating: { type: Number, required: true, min: 0, max: 5 },

        phone: { type: String, required: true },
        whatsapp: { type: String, required: true },
        email: { type: String, required: true },

        location: { type: String, required: true },

        coverage: {
            maxDistance: { type: Number, required: true },
            cities: [{ type: String, required: true }],
        },

        services: [{ type: String, required: true }],

        aboutMe: { type: String, required: true },

        gallery: [
            { type: ImageSchema, required: true },
        ],
    },
    { timestamps: true }
);

// Generador automático de slug si no se envía
ServiceProviderSchema.pre("validate", async function (next) {
    if (!this.slug && this.enterpriseName) {
        const baseSlug = this.enterpriseName
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Elimina tildes
            .trim()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        let slug = baseSlug;
        let counter = 1;

        // Verificamos si ya existe un proveedor con ese slug
        const ServiceProviderModel = mongoose.model("ServiceProvider");

        while (await ServiceProviderModel.exists({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }

    next();
});


export default mongoose.model<IServiceProvider>("ServiceProvider", ServiceProviderSchema);

