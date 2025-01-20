import Express from "express"
import { authGoogle } from '../controllers/authController'


const router = Express.Router()

router.post('/google', authGoogle)


export default router;