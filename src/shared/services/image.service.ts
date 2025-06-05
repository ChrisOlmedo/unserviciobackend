import Image from "@shared/models/image.model"
import { IImage } from "@shared/types";
import { Types, ClientSession } from "mongoose";

/**
 * @module ImageService
 * @description Service for managing images related to service providers.
 */

export async function saveGallery(
    gallery: IImage[],
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
): Promise<IImage[]> {
    const imagesDoc: IImage[] = await Image.insertMany(
        gallery.map(img => ({
            url: img.url,
            public_id: img.public_id,
            type: "gallery",
            serviceProviderId: serviceProviderId,
            userId: userId
        })),
        { session }
    );
    return imagesDoc;
}

export async function saveLogo(
    logo: IImage,
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
): Promise<IImage> {
    const logoDoc: IImage[] = await Image.create([{
        url: logo.url,
        public_id: logo.public_id,
        type: "logo",
        serviceProviderId: serviceProviderId,
        userId: userId
    }], { session });
    return logoDoc[0].toObject();
}

export async function deleteImages(galleryIds: string[]): Promise<void> {
    if (galleryIds.length > 0) {
        await Image.deleteMany({ _id: { $in: galleryIds } });
    }
}

export async function getPublicIdsByIdsWithUserIdValidation(
    imageIds: Types.ObjectId[],
    userId: Types.ObjectId): Promise<string[]> {
    const images = await Image.find({ _id: { $in: imageIds }, userId }).select('public_id').lean();
    return images.map((img: any) => img.public_id);
}

export async function getMediaByServiceProviderId(serviceProviderId: Types.ObjectId): Promise<{ logo: IImage, gallery: IImage[] }> {
    const [logoDoc, galleryDocs] = await Promise.all([
        Image.findOne({ type: "logo", serviceProviderId: serviceProviderId }),
        Image.find({ type: "gallery", serviceProviderId: serviceProviderId })
    ]);
    if (!logoDoc) {
        throw new Error("Logo not found for the given service provider ID");
    }
    return {
        logo: logoDoc,
        gallery: galleryDocs
    };
}

export async function createMedia(
    logo: IImage,
    gallery: IImage[],
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
): Promise<{ logo: IImage | null, gallery: IImage[] }> {
    const [logoDoc, galleryDocs] = await Promise.all([
        saveLogo(logo, serviceProviderId, userId, session),
        saveGallery(gallery, serviceProviderId, userId, session)
    ]);
    return {
        logo: logoDoc,
        gallery: galleryDocs
    };
}


export async function updateMedia(
    newLogo: IImage | null,
    newGallery: IImage[],
    imagesToDelete: Types.ObjectId[],
    serviceProviderId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
): Promise<{ logo: IImage, gallery: IImage[] }> {
    // ─── PASO 1: Eliminar imágenes específicas ──────────────────
    if (imagesToDelete.length > 0) {
        await Image.deleteMany({
            _id: { $in: imagesToDelete },
            userId // Seguridad: solo del usuario actual
        }, { session }
        ).exec();
    }

    // ─── PASO 2: Procesar logo ─────────────────────────────────
    let logoResult = null;
    if (newLogo) {
        // Crear nuevo logo
        logoResult = await saveLogo(newLogo, serviceProviderId, userId, session)
    } else {
        // Obtener logo existente si no hay cambio
        logoResult = await Image.findOne({
            serviceProviderId: serviceProviderId,
            type: 'logo',
            userId
        });
    }
    if (!logoResult) {
        throw new Error("Logo not found for the given service provider ID");
    }

    // ─── PASO 3: Procesar galería ──────────────────────────────

    if (newGallery.length > 0) {
        // Agregar nuevas imágenes (sin borrar existentes)
        await saveGallery(newGallery, serviceProviderId, userId, session);
    }

    // Obtener galería completa actualizada
    const currentGallery = await Image.find({
        serviceProviderId: serviceProviderId,
        type: 'gallery',
        userId
    }).session(session || null);

    return {
        logo: logoResult,
        gallery: currentGallery // Combinar nuevas + existentes
    };
}
/*
export async function getImageByServiceProviderId(imageId: Types.ObjectId): Promise<IImage | null> {
    return await Image.findById(imageId).lean();
}
    */