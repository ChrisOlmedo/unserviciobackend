import { Request, Response } from 'express'
import dotenv from 'dotenv'
import { authGoogleService } from '../service'
import { setToken } from '../utils/jwt'
import userFormatter from '@shared/utils/userFormatter'
import { IUserDocument } from '@modules/user/types'
dotenv.config();

export const authGoogle = async (req: Request, res: Response) => {
    try {
        const user: IUserDocument = await authGoogleService(req.body.token);
        setToken(res, user); // 💡 La cookie se maneja aquí
        res.json(userFormatter(user));
    } catch (error) {
        console.error('Error en authGoogle:', error);
        res.status(401).json({ message: 'Token inválido o error interno' });
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