import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbConnection: string | undefined = process.env.DB_CONNECTION;

if (!dbConnection) {
  throw new Error('DB_CONNECTION is not defined in the environment variables');
}

const connectDB = async (): Promise<void> => {
  console.log('Conectando a MongoDB...');
  try {
    await mongoose.connect(dbConnection, {});
    console.log('MongoDB conectado correctamente');
  } catch (error: any) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detiene la aplicación en caso de error
  }
};

export default connectDB;