import express from "express"
import diaryRoutes from "./routes/test"
import cors from "cors"
import corsOptions from "./config/cors.config"
import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'
import main from './collections/users'
import User from './models/userSchema'
import connectDB from "./config/db.config"



dotenv.config()

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

app.get('/api/auth/:idClient', async (req, res) => {
    console.log('solicitud recibida de usuario')

    await connectDB(); // Conectar a la base de datos
    const { idClient } = req.params;
    console.log(idClient)
    try {
        const user = await User.findOne({ id: idClient });

        if (!user) {
            console.log('Usuario no encontrado');
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        console.log('Usuario encontrado:', user);
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ message: 'Error al obtener usuario por ID' });
    }
});


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
        const { email, name } = payload;
        if (!name || !email) {
            // Si alguna propiedad es undefined, lanzar un error o manejarlo
            throw new Error('Nombre o correo electrónico faltantes')
        }

        const user = await User.findOne({ email: email })

        if (user) {
            res.json(user.id)
        } else {
            const newId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const userData = {
                "id": newId,
                "name": name,
                "email": email
            };
            await main(userData);
            res.json(newId)
        }

        // Retorna el ID y datos básicos al frontend
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
