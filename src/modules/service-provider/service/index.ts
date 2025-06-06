import ServiceProvider from '../model';
import { Types } from 'mongoose';
import ImageModel from '@shared/models/image.model';
import mongoose from 'mongoose';
import { ServiceProviderData } from '@shared/types';

export async function getServiceProviderBySlug(slug: string):
    Promise<ServiceProviderData | null> {
    // 4. Respuesta con poblado de referencias
    const provider = await ServiceProvider
        .findOne({ slug })
        .populate('logo')
        .populate('gallery')
        .lean();

    return provider as ServiceProviderData | null;
}

export async function getServiceProviders() {
    const cardData = await ServiceProvider.find({ status: 'active' })
        .select('slug enterpriseName serviceCategories')
        .populate('logo')
        .lean();

    if (!cardData || cardData.length === 0) {
        throw new Error("No se encontraron proveedores");
    }

    return cardData;
}

export async function getServiceProviderByUserId(userId: Types.ObjectId):
    Promise<ServiceProviderData | null> {
    // 1. Obtener el proveedor
    console.log('Obteniendo proveedor por userId:', userId);
    const provider = await ServiceProvider
        .findOne({ userId })
        .populate('logo')
        .populate('gallery');

    // 3. Estructurar respuesta
    return provider as ServiceProviderData | null;
}

export const deleteServiceProvider = async (userId: Types.ObjectId) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await ImageModel.deleteMany({ userId }).session(session);
        await ServiceProvider.findOneAndDelete({ userId }, { session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};