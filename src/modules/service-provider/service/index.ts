import ServiceProvider from '../model';
import { Types } from 'mongoose';
import ImageModel from '@shared/models/image.model';
import mongoose from 'mongoose';
import { getMediaByServiceProviderId } from '@shared/services/image.service';



export async function getServiceProviderBySlug(slug: string) {
    // 4. Respuesta con poblado de referencias
    const result = await ServiceProvider.findOne({ slug });
    if (!result) {
        throw new Error("Proveedor no encontrado");
    }
    // 5. Obtener imágenes relacionadas (más eficiente que populate)
    const { logo, gallery } = await getMediaByServiceProviderId(result._id);
    // 6. Estructurar respuesta

    return {
        ...result,
        logo,
        gallery,

    };
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

export async function getServiceProviderByUserId(userId: Types.ObjectId) {

    // 1. Obtener el proveedor
    console.log('Obteniendo proveedor por userId:', userId);
    const provider = await ServiceProvider.findOne({ userId: userId });
    if (!provider) throw new Error("Proveedor no encontrado");

    // 2. Obtener imágenes relacionadas (más eficiente que populate)
    const [logo, gallery] = await Promise.all([
        ImageModel.findOne({
            userId: userId,
            type: 'logo'
        }),
        ImageModel.find({
            userId: userId,
            type: 'gallery'
        })
    ]);

    // 3. Estructurar respuesta
    return {
        ...provider.toObject(),
        logo: logo,
        gallery,
    };
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