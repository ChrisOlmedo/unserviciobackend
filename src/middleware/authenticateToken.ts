import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
export interface AuthRequest extends Request {
    userId?: mongoose.Types.ObjectId;
}


export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    console.log('Token recibido:', token);
    if (!token) {
        console.log('Acceso denegado. No hay token.');
        res.status(401).json({ message: "Acceso denegado. No hay token." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: mongoose.Types.ObjectId };
        console.log('Token decodificado:', decoded.id);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        console.error('Token inválido:', error);
        res.status(403).json({ message: "Token inválido." });
        return;
    }
};

