import User from '../models/userModel'
import { Response } from 'express'
import userFormatter from '../utils/userFormatter'
import { AuthRequest } from '../middleware/authenticateToken'

export const getData = async (req: AuthRequest, res: Response) => {
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