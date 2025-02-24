import Express from "express"
import { getDataProvider, createNewProvider, getAllProviders } from '../controllers/providerController'
import { authenticateToken } from '../middleware/authenticateToken';

const router = Express.Router()

router.get('/getProviders', getAllProviders);
router.get('/getProvider/:slug', getDataProvider);
router.put('/createProvider/:slug', authenticateToken, createNewProvider);


export default router;