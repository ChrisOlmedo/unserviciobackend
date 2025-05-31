import User from '../models/userModel'
import { Request, Response } from 'express'
import userFormatter from '../utils/userFormatter'
import { AuthRequest } from '../middleware/authenticateToken'

export const getUser = async (req: AuthRequest, res: Response) => {
    console.log('solicitud recibida de usuario')

    const userId = req.userId;
    console.log(userId)
    try {
        const user = await User.findById(userId).select("-_id -__v");
        if (!user) {
            console.log('Usuario no encontrado')
            res.status(404).json({ message: 'Usuario no encontrado' })
            return;
        }

        console.log('Usuario encontrado:', user);
        res.json(userFormatter(user));
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ message: 'Error al obtener usuario por ID' });
    }
}

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,  // Asegúrate de que no sea accesible desde el frontend
        secure: process.env.NODE_ENV === "production",  // Solo en HTTPS en producción
        sameSite: "lax",  // Para no bloquear la cookie en localhost
        maxAge: 0,  // Expira inmediatamente
    });

    res.status(200).json({ message: "Sesión cerrada exitosamente" });
};
