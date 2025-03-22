import Express from "express"
import { getDataProvider, createNewProvider, getAllProviders } from '../controllers/providerController'
import { authenticateToken } from '../middleware/authenticateToken';

const router = Express.Router()

router.get('/', getAllProviders);
router.get('/:slug', getDataProvider);
router.put('/:slug', authenticateToken, createNewProvider);


export default router;