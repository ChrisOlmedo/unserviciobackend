import Express from "express"
import { getData } from '../controllers/userController'
const router = Express.Router()

router.get('/getData/:idClient', getData)



export default router;