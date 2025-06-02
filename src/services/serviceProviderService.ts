import ServiceProvider from '../models/serviceProviderModel';
import { ServiceProviderData } from '../types/types';
import { Types } from 'mongoose';
import ImageModel from '../models/imageModel';
import mongoose from 'mongoose';

export async function createServiceProvider(data: Omit<ServiceProviderData, 'userId'>, userId: Types.ObjectId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const serviceProvider = await ServiceProvider.create([{
            userId: userId,
            slug: data.slug,
            enterpriseName: data.enterpriseName,
            serviceCategories: data.serviceCategories,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            location: data.location,
            coverage: data.coverage,
            services: data.services,
            aboutMe: data.aboutMe,
        }], { session });
        console.log('Service Provider created:', serviceProvider);
        if (!serviceProvider || !serviceProvider[0]) {
            throw new Error('Error creating service provider');
        }

        const spId: Types.ObjectId = serviceProvider[0]._id as Types.ObjectId;
        if (!spId) {
            throw new Error('Service provider ID is missing after creation');
        }

        // 2. Manejo de imágenes (logo + galería)
        const [logoDoc, galleryDocs] = await Promise.all([
            data.logo ? ImageModel.create([{
                url: data.logo.url,
                public_id: data.logo.public_id,
                type: "logo",
                serviceProviderId: spId,
                ownerId: userId
            }], { session }) : Promise.resolve([]),

            Array.isArray(data.gallery) ? ImageModel.insertMany(
                data.gallery.map(img => ({
                    url: img.url,
                    public_id: img.public_id,
                    type: "gallery",
                    serviceProviderId: spId,
                    ownerId: userId
                })), { session }
            ) : Promise.resolve([])
        ]);

        await session.commitTransaction();

        // 3. Construir respuesta
        return {
            ...serviceProvider[0].toObject(),
            logo: logoDoc[0] || null,
            gallery: galleryDocs,
        };

    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw new Error('Failed to create service provider with images');
    } finally {
        session.endSession();
    }
}
export async function getServiceProviderBySlug(slug: string) {
    // 4. Respuesta con poblado de referencias
    const result = await ServiceProvider.findOne({ slug });

    return result;
}
/*
export async function getServiceProviderById(id: Types.ObjectId) {
    // 1. Obtener el proveedor
    const provider = await ServiceProvider.findById(id);
    if (!provider) throw new Error("Proveedor no encontrado");

    // 2. Obtener imágenes relacionadas (más eficiente que populate)
    const [logo, gallery] = await Promise.all([
        ImageModel.findOne({ 
            serviceProviderId: id, 
            type: 'logo' 
        }),
        ImageModel.find({ 
            serviceProviderId: id, 
            type: 'gallery' 
        })
    ]);

    // 3. Estructurar respuesta
    return {
        ...provider.toObject(),
        id: provider._id.toString(),
        logo: logo ? {
            id: logo._id.toString(),
            url: logo.url,
            public_id: logo.public_id
        } : null,
        gallery: gallery.map(img => ({
            id: img._id.toString(),
            url: img.url,
            public_id: img.public_id
        }))
    };
}
*/
export async function getServiceProviders() {
    return await ServiceProvider.find({}).select('_id name slug');
}

export async function getServiceProviderByUserId(userId: string) {
    return await ServiceProvider.findOne({ userId });
}

export const deleteServiceProvider = async (spId: Types.ObjectId) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await ImageModel.deleteMany({ serviceProviderId: spId }).session(session);
        await ServiceProvider.findByIdAndDelete(spId).session(session);
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};