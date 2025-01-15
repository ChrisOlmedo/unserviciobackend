import express from "express"
import diaryRoutes from "./routes/test"
import cors from "cors"
import corsOptions from "./config/cors.config"
import { OAuth2Client } from 'google-auth-library';

import dotenv from 'dotenv'
dotenv.config();

const app = express()

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


const CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
    console.log('Solicitud recibida en /api/auth/google');
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid token payload');
        }
        const { /*email, name, sub*/ name } = payload;
        /*
        // Busca al usuario en la base de datos
        let user = await User.findOne({ email });
        if (!user) {
            // Crea un nuevo usuario si no existe
            user = await User.create({ email, name, picture });
        }*/

        // Retorna el ID y datos básicos al frontend
        console.log(name)
        res.json(name);
        console.log("respuesta enviada")
    } catch (error) {
        console.error('Error al verificar el token de Google:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
});



const PORT = process.env.PORT || 3000
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
