import Express from "express"
import { getPublicServiceProvider, createNewServiceProvider, getAllServiceProviders, getMyServiceProvider } from '../controllers/serviceProviderController'
import { authenticateToken } from '../middleware/authenticateToken';

const router = Express.Router()

// Rutas públicas
router.get('/', getAllServiceProviders);
router.get('/:slug', getPublicServiceProvider);

// Rutas protegidas que requieren autenticación
router.get('/me', authenticateToken, getMyServiceProvider);
router.post('/me', authenticateToken, createNewServiceProvider);
router.put('/me', authenticateToken);
router.delete('/me', authenticateToken);

export default router;