import Express from "express"
import { getData } from '../controllers/userController'
import { authenticateToken } from '../middleware/authenticateToken';
const router = Express.Router()

router.get('/me', authenticateToken, getData);
router.put('/')
router.delete('/')



export default router;