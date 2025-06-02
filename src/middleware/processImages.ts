// src/middlewares/processImages.ts
import { Request, Response, NextFunction } from "express";
import { uploadBufferToCloudinary } from "../services/cloudinaryService";
import { parseJSONField } from "../utils/dataParser";

const CLOUDINARY_BASE_PATH = "service-providers";

const CLOUDINARY_PATHS = {
    LOGOS: `${CLOUDINARY_BASE_PATH}/logos`,
    GALLERY: `${CLOUDINARY_BASE_PATH}/gallery`,
};

export const processImages = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        console.log('¿Multer procesó los archivos?', req.files); // Debug 1
        console.log('Cabeceras de la petición:', req.headers['content-type']); // Debug 2

        if (!req.files) {
            console.error('ERROR: req.files es undefined. ¿Multer está configurado?');
            return next();
        }
        // Mejor forma de manejar req.files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
        const isPut = req.method === 'PUT';

        // ─── LOGO ────────────────────────────────────────────────────
        let finalLogo = req.body.logo ? parseJSONField(req.body.logo) : null;

        // Verificamos si hay archivo de logo (usando el nombre exacto del campo)
        if (files['logoFile'] && files['logoFile'][0]) {
            finalLogo = await uploadBufferToCloudinary(
                files['logoFile'][0].buffer,
                CLOUDINARY_PATHS.LOGOS
            );
        }

        // ─── GALERÍA ────────────────────────────────────────────────
        let finalGallery = isPut ? [...(req.body.gallery ? parseJSONField(req.body.gallery) : [])] : [];

        // Verificamos si hay nuevas imágenes para la galería
        if (files['galleryNewImages[]']) {
            const newGalleryImages = await Promise.all(
                files['galleryNewImages[]'].map(file =>
                    uploadBufferToCloudinary(file.buffer, CLOUDINARY_PATHS.GALLERY)
                )
            );
            finalGallery.push(...newGalleryImages);
        }

        // ─── ACTUALIZAR RE.BODY ──────────────────────────────────
        req.body = {
            ...req.body,
            logo: finalLogo,
            gallery: finalGallery
        };

        console.log('Procesamiento de imágenes completado');
        next();
    } catch (error) {
        console.error('Error en processImages:', error);
        next(error);
    }
};