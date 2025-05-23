import User from '../models/userModel'
import { Request, Response } from 'express'


export const getData = async (req: Request, res: Response) => {
    console.log('solicitud recibida de usuario')

    const { idClient } = req.params
    console.log(idClient)
    try {
        const user = await User.findOne({ id: idClient })
        if (!user) {
            console.log('Usuario no encontrado')
            res.status(404).json({ message: 'Usuario no encontrado' })
            return;
        }

        console.log('Usuario encontrado:', user);
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ message: 'Error al obtener usuario por ID' });
    }
}