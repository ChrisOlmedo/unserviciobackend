import mongoose, { Types } from 'mongoose';
import ServiceProvider from '../model';
import { createMedia } from '@shared/services/image.service';
import { updateRoleToServiceProvider } from '@modules/user/service';
import { ServiceProviderRequest, ServiceProviderData } from '@shared/types';

/**
 * @module ServiceProviderService
 * @description Service for creating a new service provider with associated media.
 */

export default async function createNewServiceProvider(data: ServiceProviderRequest, userId: Types.ObjectId):
    Promise<ServiceProviderData> {
    const serviceProviderId = new Types.ObjectId();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // 1. Manejo de imágenes (logo + galería)
        const { logo, gallery } = await createMedia(
            data.newLogo,
            data.newGallery,
            serviceProviderId,
            userId,
            session
        );
        if (!logo) {
            throw new Error('Error creating logo image');
        }
        if (!gallery || gallery.length === 0) {
            throw new Error('Error creating gallery images');
        }
        const serviceProvider = await ServiceProvider.create([{
            _id: serviceProviderId,
            userId: userId,
            logo: logo._id, // Guardar solo el ID de la imagen
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
            gallery: gallery.map(img => img._id), // Guardar solo los IDs de las imágenes de la galería
        }], { session });

        if (!serviceProvider || !serviceProvider[0]) {
            throw new Error('Error creating service provider');
        }

        console.log("Data to create service provider:", data);

        await updateRoleToServiceProvider(userId, session);

        await session.commitTransaction();

        // 3. Construir respuesta
        return {
            ...serviceProvider[0].toObject(),
            logo,
            gallery,
        };
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw new Error('Failed to create service provider with images');
    } finally {
        session.endSession();
    }
}