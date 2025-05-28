import Express from "express"
import { getProvider, createNewProvider, getAllProviders } from '../controllers/providerController'
import { authenticateToken } from '../middleware/authenticateToken';

const router = Express.Router()

// Rutas públicas
router.get('/', getAllProviders);
router.get('/:slug', getProvider);

// Rutas protegidas que requieren autenticación
router.get('/me', authenticateToken);
router.post('/me', authenticateToken, createNewProvider);
router.put('/me', authenticateToken);
router.delete('/me', authenticateToken);

export default router;