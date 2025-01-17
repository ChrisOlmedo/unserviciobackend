import { CorsOptions } from "cors"

const allowedOrigins = ['https://unservicio.com', 'http://localhost:5173']; // Lista de orígenes permitidos
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            // Permite la solicitud si el origen está en la lista o no tiene origen (e.g., herramientas locales)
            callback(null, true);
        } else {
            // Bloquea la solicitud si el origen no está permitido
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

export default corsOptions