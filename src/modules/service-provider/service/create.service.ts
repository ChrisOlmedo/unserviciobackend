import mongoose, { Types } from 'mongoose';
import ServiceProvider from '../model';
import { createMedia } from '@shared/services/image.service';
import { updateRoletoServiceProvider } from '@modules/user/service';

/**
 * @module ServiceProviderService
 * @description Service for creating a new service provider with associated media.
 */

export default async function createNewServiceProvider(data: any, userId: Types.ObjectId) {
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

        if (!serviceProvider || !serviceProvider[0]) {
            throw new Error('Error creating service provider');
        }

        const spId: Types.ObjectId = serviceProvider[0]._id;
        if (!spId) {
            throw new Error('Service provider ID is missing after creation');
        }
        console.log("Data to create service provider:", data);

        // 2. Manejo de imágenes (logo + galería)
        const { logo, gallery } = await createMedia(
            data.newLogo,
            data.newGallery,
            spId,
            userId,
            session
        );

        await updateRoletoServiceProvider(userId, session);

        await session.commitTransaction();

        // 3. Construir respuesta
        return {
            ...serviceProvider[0].toObject(),
            logo: logo,
            gallery: gallery,
        };

    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw new Error('Failed to create service provider with images');
    } finally {
        session.endSession();
    }
}