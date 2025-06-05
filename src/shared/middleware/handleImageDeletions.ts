import { Request, Response, NextFunction } from "express";
import { deleteFromCloudinary } from "../services/cloudinary.service";
import mongoose from "mongoose";
import { safeParse } from "../utils/dataParser";
import { getPublicIdsByIdsWithUserIdValidation } from "@shared/services/image.service";
// Solo aplica para rutas PUT
// Middleware de eliminación seguro y simple
export const handleImageDeletions = async (req: Request, _res: Response, next: NextFunction) => {
    let { deletedImages = [] } = req.body;
    deletedImages = safeParse(deletedImages, []);

    if (!Array.isArray(deletedImages) || deletedImages.length === 0) {
        console.warn('No hay imágenes para eliminar o el formato es incorrecto');
        return next();
    }
    const objectIds = deletedImages.map((id: string) => new mongoose.Types.ObjectId(id));
    const userId = (req as any).userId; // Asume que tienes el ID del usuario autenticado

    // 1. Extraer los public_ids de las imágenes a eliminar
    if (objectIds.length === 0) {
        console.warn('No hay IDs de imágenes válidos para eliminar');
        return next();
    }
    console.log('IDs de imágenes a eliminar:', objectIds);
    const validPublicIds = await getPublicIdsByIdsWithUserIdValidation(objectIds, userId);
    console.log('Public IDs válidos para eliminar:', validPublicIds);


    // 3. Eliminar de Cloudinary
    await Promise.all(
        validPublicIds.map(public_id => deleteFromCloudinary(public_id))
    );

    // ─── ACTUALIZAR RE.BODY ──────────────────────────────────
    req.body = {
        ...req.body,
        deletedImages: objectIds // Mantener los IDs originales para referencia
    };

    next();
};