import express from "express"
import diaryRoutes from "./routes/test"
import authRoutes from './routes/authRoute'
import userRoutes from './routes/userRoutes'
import cors from "cors"
import corsOptions from "./config/cors.config"
import dotenv from 'dotenv'
import connectDB from "./config/db.config"

dotenv.config()
const app = express()

connectDB();

app.use(cors(corsOptions)) // Aplica el middleware de CORS
app.use(express.json())

app.get('/', (_, res) => {
    res.send('This is the backend')
})
app.get('/api/test', (_, res) => {
    console.log('Solicitud recibida en /api/test')
    res.json({ message: 'Hola frontend, este es un mensaje desde el Backend' })
})
app.use('/api/routes', diaryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 3000

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
