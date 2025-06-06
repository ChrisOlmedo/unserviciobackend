import Express from "express"
import {
    getPublicServiceProvider,
    createNewServiceProvider,
    getAllServiceProviders,
    getMyServiceProvider,
    updateServiceProviderController
} from './controller';
import { authenticateToken } from '@shared/middleware/authenticateToken';
import { processImages } from '@shared/middleware/processImages';
import { upload } from '@shared/config/multer.config';
import { handleImageDeletions } from "@shared/middleware/handleImageDeletions";
import { parseServiceProviderData } from "./middleware/parseServiceProviderData";

const router = Express.Router()

// Rutas públicas
router.get('/public/service/all', getAllServiceProviders);
router.get('/public/:slug', getPublicServiceProvider);

// Rutas protegidas que requieren autenticación
router.get('/me', authenticateToken, getMyServiceProvider);

router.post('/me',
    authenticateToken,
    upload.fields([
        { name: 'logoFile', maxCount: 1 },
        { name: 'galleryNewImages[]', maxCount: 6 }
    ]),
    processImages,
    parseServiceProviderData,
    createNewServiceProvider
);

router.put('/me',
    authenticateToken,
    upload.fields([
        { name: 'logoFile', maxCount: 1 },
        { name: 'galleryNewImages[]', maxCount: 6 }
    ]),
    processImages,
    handleImageDeletions,
    parseServiceProviderData,
    updateServiceProviderController
);

router.delete('/me', authenticateToken);


export default router;