import express from "express"
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import providerRoutes from './routes/providerRoutes'
import cors from "cors"
import corsOptions from "./config/cors.config"
import dotenv from 'dotenv'
import connectDB from "./config/db.config"
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()

connectDB();

app.use(cors(corsOptions)) // Aplica el middleware de CORS
app.use(express.json())
app.use(cookieParser());


app.get('/', (_, res) => {
    res.send('This is the backend')
})
app.get('/api/test', (_, res) => {
    console.log('Solicitud recibida en /api/test')
    res.json({ message: 'Hola frontend, este es un mensaje desde el Backend' })
})


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/service_providers', providerRoutes)

const PORT = process.env.PORT || 3000

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
