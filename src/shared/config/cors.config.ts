import { CorsOptions } from "cors";


const allowedOrigins = ['https://unservicio.com', 'http://localhost:5173'];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS bloqueado para: ${origin}`); // 🛑 Mensaje de advertencia en la consola
            callback(null, false); // En lugar de un error, solo bloquea la petición
        }
    },
    credentials: true, // Permitir envío de cookies y credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Agregamos OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
