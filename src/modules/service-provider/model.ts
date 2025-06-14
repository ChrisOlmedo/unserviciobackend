import mongoose, { Schema } from "mongoose";
import { IServiceProvider } from "./types";
import { generateUniqueSlug } from "./utils";

const ServiceProviderSchema = new Schema<IServiceProvider>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        slug: { type: String, required: true, unique: true },
        logo: { type: Schema.Types.ObjectId, ref: "Image", required: true },
        enterpriseName: { type: String, required: true },
        serviceCategories: [{ type: String, required: true }],
        phone: { type: String, required: true },
        whatsapp: { type: String, required: true },
        email: { type: String, required: true },
        status: {
            type: String,
            enum: ['active', 'inactive', 'deleted'],
            default: 'active'
        },
        location: { type: String, required: true },
        coverage: {
            maxDistance: { type: Number, required: true },
            cities: [{ type: String, required: true }],
        },
        services: [{ type: String, required: true }],
        aboutMe: { type: String, required: true },
        gallery: [{ type: Schema.Types.ObjectId, ref: "Image" }],
        lastEnterpriseNameChange: Date,
        slugHistory: [
            {
                slug: { type: String, required: true },
                changedAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Generador automático de slug si no se envía
ServiceProviderSchema.pre("validate", async function (next) {
    if (!this.slug && this.enterpriseName) {
        this.slug = await generateUniqueSlug(this.enterpriseName);
    }
    next();
});

ServiceProviderSchema.pre('save', async function (next) {
    if (this.isNew) return next();
    if (this.isModified('enterpriseName')) {
        // Validar período mínimo

        if (this.canChangeEnterpriseName()) {
            return next(new Error('Deben pasar 2 meses entre cambios de nombre'));
        }

        // Generar nuevo slug
        const newSlug = await generateUniqueSlug(this.enterpriseName);
        this.slugHistory.push({ slug: this.slug, changedAt: new Date() });
        this.slug = newSlug;
        this.lastEnterpriseNameChange = new Date();
    }
    next();
});

/*
ServiceProviderSchema.methods.softDelete = async function () {
    this.status = "inactive";
    await this.save();
    deleteImages(this.userId).catch(console.error);
};
*/
/* --------------  función reutilizable dentro del esquema -------------- */
ServiceProviderSchema.methods.canChangeEnterpriseName = function (): boolean {
    if (!this.lastEnterpriseNameChange) return true;
    const diffDays = (Date.now() - this.lastEnterpriseNameChange.getTime()) / 86_400_000;
    return diffDays >= 60;
};

ServiceProviderSchema.virtual('canEditEnterpriseName').get(function (this: IServiceProvider) {
    return this.canChangeEnterpriseName();
});



export default mongoose.model<IServiceProvider>("ServiceProvider", ServiceProviderSchema);

