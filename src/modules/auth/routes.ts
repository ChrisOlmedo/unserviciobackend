import Express from "express"
import { authGoogle, logout } from './controller'

const router = Express.Router()

router.post('/login')
router.post('/register')
router.post('/google', authGoogle)
router.post('/facebook')
router.post('/logout', logout)
router.post('/refresh-token')


export default router;