import Express from "express"
import { getData, logout } from '../controllers/userController'
import { authenticateToken } from '../middleware/authenticateToken';
const router = Express.Router()

router.get('/', authenticateToken, getData);
router.post('/logout', logout);

export default router;