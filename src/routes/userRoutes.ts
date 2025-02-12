import Express from "express"
import { getData } from '../controllers/userController'
import { authenticateToken } from '../middleware/authenticateToken';
const router = Express.Router()

router.get('/getData', authenticateToken, getData)

export default router;