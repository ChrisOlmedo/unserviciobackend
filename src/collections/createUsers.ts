import connectDB from '../config/db.config';
import User, { IUser } from '../models/userModel';


const main = async (dataUser: IUser) => {
    await connectDB(); // Conectar a la base de datos

    try {
        // Crear un nuevo cliente
        const newUser = new User(dataUser);

        // Guardar el cliente en la base de datos
        const savedUser = await newUser.save();
        console.log('Documento insertado:', savedUser);
    } catch (error) {
        console.error('Error al insertar el documento:', error);
    }
};

export default main;
