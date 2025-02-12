import { OAuth2Client } from 'google-auth-library'
import { Request, Response } from 'express'
import { createUser, getUser } from '../services/userService'
import dotenv from 'dotenv'
import userFormatter from '../utils/userFormatter'
import jwt from "jsonwebtoken";
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
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
            // 🔹 Configurar cookie HTTP-Only
            res.cookie("token", token, {
                httpOnly: true,  // 🔒 Evita acceso desde JavaScript del frontend  
                secure: false,  // 🔹 No usar HTTPS en desarrollo
                sameSite: "lax",  // 🔹 "strict" puede bloquear cookies en localhost
                /* Habilitar para produccion
                secure: process.env.NODE_ENV === "production",  // Solo en HTTPS en producción
                sameSite: "strict",  // Evita envío en solicitudes de otros sitios
                // */
                maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 días
            });
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
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

            // 🔹 Configurar cookie HTTP-Only
            res.cookie("token", token, {
                httpOnly: true,  // 🔒 Evita acceso desde JavaScript del frontend  
                secure: false,  // 🔹 No usar HTTPS en desarrollo
                sameSite: "lax",  // 🔹 "strict" puede bloquear cookies en localhost
                /* Habilitar para produccion
                secure: process.env.NODE_ENV === "production",  // Solo en HTTPS en producción
                sameSite: "strict",  // Evita envío en solicitudes de otros sitios
                // */
                maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 días
            });
            res.json(userFormatter(newUser));
        }
        // Retorna el ID y datos básicos al frontend
    } catch (error) {
        console.error('Error al verificar iniciar sesion con Google:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};