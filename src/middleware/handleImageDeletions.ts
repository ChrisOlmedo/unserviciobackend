import { Request, Response, NextFunction } from "express";
import { deleteFromCloudinary } from "../services/cloudinaryService";
import ImageModel from "../models/imageModel";

// Solo aplica para rutas PUT
// Middleware de eliminación seguro y simple
export const handleImageDeletions = async (req: Request, _res: Response, next: NextFunction) => {
    const { deletedImages = [] } = req.body;
    const userId = (req as any).userId; // Asume que tienes el ID del usuario autenticado

    // 1. Buscar las imágenes en MongoDB y validar ownership
    const images = await ImageModel.find({
        _id: { $in: deletedImages },
        userId // Asegura que el usuario sea dueño de las imágenes
    });

    // 2. Extraer public_id válidos
    const validPublicIds = images.map(img => img.public_id);

    // 3. Eliminar de Cloudinary
    await Promise.all(
        validPublicIds.map(public_id => deleteFromCloudinary(public_id))
    );

    // 4. Eliminar de MongoDB
    await ImageModel.deleteMany({
        _id: { $in: deletedImages },
        userId
    });

    next();
};