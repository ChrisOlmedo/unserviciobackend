import { OAuth2Client } from 'google-auth-library'
import { Request, Response } from 'express'
import { createUser, getUser } from '../services/userService'
import dotenv from 'dotenv'
import userFormatter from '../utils/userFormatter'
import { setAuthCookie } from '../services/authCookies'
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
            console.log('Usuario encontrado:', user);

            setAuthCookie(res, user);
            console.log();
            res.json(userFormatter(user));
        } else {
            console.log('Usuario nuevo')
            const newId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const user = {
                userId: newId,
                name: name,
                email: email
            };
            const newUser = await createUser(user);
            console.log('Usuario creado:', newUser);
            if (!newUser) {
                throw new Error('Error al crear el usuario');
            }
            setAuthCookie(res, newUser);
            res.json(userFormatter(newUser));
        }
        // Retorna el ID y datos básicos al frontend
    } catch (error) {
        console.error('Error al verificar iniciar sesion con Google:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

export const logout = (_req: Request, res: Response) => {
    console.log('Solicitud recibida en /api/auth/logout');
    res.clearCookie("token", {
        httpOnly: true,  // Asegúrate de que no sea accesible desde el frontend
        secure: process.env.NODE_ENV === "production",  // Solo en HTTPS en producción
        sameSite: "lax",  // Para no bloquear la cookie en localhost
        maxAge: 0,  // Expira inmediatamente
    });

    res.status(200).json({ message: "Sesión cerrada exitosamente" });
};