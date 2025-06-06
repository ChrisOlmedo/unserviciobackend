import mongoose, { Types } from 'mongoose';
import ServiceProvider from '../model';
import { ServiceProviderData } from '../types';
import { updateMedia } from '@shared/services/image.service';
import { IImage, ServiceProviderRequest } from '@shared/types';


export default async function updateServiceProvider(data: ServiceProviderRequest, userId: Types.ObjectId):
    Promise<ServiceProviderData> {

    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('Asi vienen las imagenes antiguas:', data.gallery);
    try {
        /* 1. Obtener proveedor */
        const currentProvider = await ServiceProvider.findOne({ userId }).session(session);
        if (!currentProvider) {
            throw new Error('Proveedor no encontrado');
        }
        /* 2. Actualizar campos simples */
        Object.assign(currentProvider, {
            serviceCategories: data.serviceCategories ?? currentProvider.serviceCategories,
            phone: data.phone ?? currentProvider.phone,
            whatsapp: data.whatsapp ?? currentProvider.whatsapp,
            email: data.email ?? currentProvider.email,
            location: data.location ?? currentProvider.location,
            coverage: data.coverage ?? currentProvider.coverage,
            services: data.services ?? currentProvider.services,
            aboutMe: data.aboutMe ?? currentProvider.aboutMe
        });

        if (data.enterpriseName && data.enterpriseName !== currentProvider.enterpriseName) {
            currentProvider.enterpriseName = data.enterpriseName;
        }
        /* 3. Media (logo + galería) – updateMedia ya devuelve la versión final */
        let logo: IImage;
        let gallery: IImage[] = [];
        ({ logo, gallery } = await updateMedia(
            data.newLogo || null,
            data.newGallery || [],
            data.deletedImages || [],
            currentProvider._id,
            userId,
            session
        ));
        console.log('Datos del logo:', logo);
        console.log('Datos de gallery:', gallery);
        console.log('Tipo de logo._id:', typeof logo._id, logo._id?.constructor?.name);
        console.log('Tipo de gallery:', gallery, gallery.map(img => img._id?.constructor?.name));


        if (logo && logo._id) {
            currentProvider.logo = logo._id; // Actualizar solo el ID del logo
        }
        if (gallery && gallery.length > 0) {
            currentProvider.gallery = gallery.map((img: IImage) => img._id); // Actualizar solo los IDs de la galería
        }
        /* 4. Guardar cambios */
        const updatedProvider = await currentProvider.save({ session });
        if (!updatedProvider) {
            throw new Error('Error al actualizar el proveedor');
        }
        await session.commitTransaction();
        console.log('Transacción completada con éxito');

        return {
            ...updatedProvider.toObject(),
            logo,
            gallery
        };
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw new Error('Failed to update service provider');
    } finally {
        session.endSession();
    }
}