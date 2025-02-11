import { OAuth2Client } from 'google-auth-library'
import { Request, Response } from 'express'
import { IUser } from '../models/userModel'
import { createUser, getUser } from '../services/userService'
import dotenv from 'dotenv'
import userFormatter from '../utils/userFormatter'
dotenv.config();

export const authGoogle = async (req: Request, res: Response) => {

    const CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);
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

        const user = await getUser({ email: email });

        if (user) {
            res.json(userFormatter(user));
        } else {
            console.log('Usuario nuevo')
            const newId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const user: IUser = {
                id: newId,
                name: name,
                email: email
            };
            const newUser = await createUser(user);
            console.log('Usuario    creado:', newUser);
            if (!newUser) {
                throw new Error('Error al crear el usuario');
            }
            res.json(userFormatter(newUser));
        }
        // Retorna el ID y datos básicos al frontend
    } catch (error) {
        console.error('Error al verificar el token de Google:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};