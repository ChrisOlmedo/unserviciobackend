import Express from "express"

const router = Express.Router()

router.get('/', (_req, res) => {
    res.send('Hola desde una ruta')
}
)

router.get('/culo', (_req, res) => {
    res.send('Que pedo con esto')
}
)

export default router;