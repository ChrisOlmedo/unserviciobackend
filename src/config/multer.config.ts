import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    preservePath: true,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 7 // Límite total de archivos (1 logo + 6 galería)
    }
});