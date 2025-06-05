import mongoose, { Types } from 'mongoose';
import ServiceProvider from '../model';
import { ServiceProviderData } from '../types';
import { updateMedia } from '@shared/services/image.service';
import { IImage } from '@shared/types';




export default async function updateServiceProvider(data: any, userId: Types.ObjectId): Promise<Partial<ServiceProviderData>> {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('Datos a actualizar:', data.logo, data.gallery, data.deletedImages,
        data.newLogo, data.newGallery
    );
    try {

        const currentProvider = await ServiceProvider.findOne({ userId }).session(session);
        if (!currentProvider) {
            throw new Error('Proveedor no encontrado');
        }
        // 1. Actualizar el proveedor
        if (data.enterpriseName && data.enterpriseName !== currentProvider.enterpriseName) {
            currentProvider.enterpriseName = data.enterpriseName;
        }
        currentProvider.serviceCategories = data.serviceCategories || currentProvider.serviceCategories;
        currentProvider.phone = data.phone || currentProvider.phone;
        currentProvider.whatsapp = data.whatsapp || currentProvider.whatsapp;
        currentProvider.email = data.email || currentProvider.email;
        currentProvider.location = data.location || currentProvider.location;
        currentProvider.coverage = data.coverage || currentProvider.coverage;
        currentProvider.services = data.services || currentProvider.services;
        currentProvider.aboutMe = data.aboutMe || currentProvider.aboutMe;

        // Guardar los cambios en el proveedor
        const updatedProvider = await currentProvider.save({ session });
        if (!updatedProvider) {
            throw new Error('Error al actualizar el proveedor');
        }

        // 2. Manejo de imágenes (logo + galería)
        // Inicializar media con tipos correctos
        let media: { logo: IImage; gallery: IImage[] };

        media = await updateMedia(
            data.newLogo || null,
            data.newGallery || [],
            data.deletedImages || [], // IDs de imágenes a borrar
            updatedProvider._id,
            userId,
            session
        );
        // Validar que logo nunca sea null
        if (!media.logo) {
            throw new Error('El proveedor debe tener un logo');
        }

        await session.commitTransaction();
        console.log('Transacción completada con éxito');

        return {
            ...updatedProvider.toObject(),
            logo: media.logo,
            gallery: media.gallery
        };
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw new Error('Failed to update service provider');
    } finally {
        session.endSession();
    }
}