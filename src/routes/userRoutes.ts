import Express from "express"
import { getUser } from '../controllers/userController'
import { authenticateToken } from '../middleware/authenticateToken';
const router = Express.Router()

router.get('/me', authenticateToken, getUser);
router.put('/')
router.delete('/')



export default router;