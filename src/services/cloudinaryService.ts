import { cloudinary } from "../config/cloudinary.config";

export const uploadBufferToCloudinary = (buffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        stream.end(buffer);
    });
};

export const deleteFromCloudinary = async (public_id: string) => {
    return await cloudinary.uploader.destroy(public_id);
};
