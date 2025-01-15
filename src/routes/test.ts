import Express from "express"

const router = Express.Router()

router.get('/', (_req, res) => {
    res.send('Hola desde una ruta')
}
)

router.get('/prueba', (_req, res) => {
    res.send('Hola mundo desde aca')
}
)

export default router;