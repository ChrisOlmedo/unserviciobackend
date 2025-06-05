import Express from "express"
import { getUser } from './controller'
import { authenticateToken } from '@shared/middleware/authenticateToken';
const router = Express.Router()

router.get('/me', authenticateToken, getUser);
router.put('/')
router.delete('/')



export default router;