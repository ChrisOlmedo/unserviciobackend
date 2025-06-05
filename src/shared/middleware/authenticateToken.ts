import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    console.log('Token recibido:', token);
    if (!token) {
        console.log('Acceso denegado. No hay token.');
        res.status(401).json({ message: "Acceso denegado. No hay token." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            (req as any).userId = new mongoose.Types.ObjectId(decoded.id);
            console.log('Debuger, se agrego Id al req', (req as any).userId);
            return next();
        } else {
            console.error('Token inválido: no contiene el campo id.');
            res.status(403).json({ message: "Token inválido." });
            return;
        }
    } catch (error) {
        console.error('Token inválido:', error);
        res.status(403).json({ message: "Token inválido." });
        return;
    }
};

