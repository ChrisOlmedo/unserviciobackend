import Express from "express"
import { getPublicServiceProvider, createNewServiceProvider, getAllServiceProviders, getMyServiceProvider } from '../controllers/serviceProviderController'
import { authenticateToken } from '../middleware/authenticateToken';
import { processImages } from '../middleware/processImages';
import { upload } from '../config/multer.config';
import { handleImageDeletions } from "../middleware/handleImageDeletions";
import { parseServiceProviderData } from "../middleware/parseServiceProviderData";

const router = Express.Router()

// Rutas públicas
router.get('/', getAllServiceProviders);
router.get('/:slug', getPublicServiceProvider);

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
    createNewServiceProvider
);

router.delete('/me', authenticateToken);


export default router;