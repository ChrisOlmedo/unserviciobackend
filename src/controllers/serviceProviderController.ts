import { Request, Response } from 'express';
import { createServiceProvider, getServiceProviderBySlug, getServiceProviders, getServiceProviderByUserId } from '../services/serviceProviderService';


export const getPublicServiceProvider = async (req: Request, res: Response) => {
    console.log('Solicitud recibida de proveedor')
    const { slug } = req.params
    console.log(slug)
    try {
        const serviceProvider = await getServiceProviderBySlug(slug);
        if (!serviceProvider) {
            console.log('Proveedor no encontrado')
            res.status(404).json({ message: 'Proveedor no encontrado' })
            return;
        }
        console.log('Proveedor encontrado:', serviceProvider);
        res.json(serviceProvider);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener proveedor por ID' });
    }
}

export const getMyServiceProvider = async (req: Request, res: Response) => {
    console.log('Solicitud recibida de proveedor')
    const { userId } = req.params
    try {
        const serviceProvider = await getServiceProviderByUserId(userId);
        if (!serviceProvider) {
            console.log('Proveedor no encontrado')
            res.status(404).json({ message: 'Proveedor no encontrado' })
            return;
        }
        console.log('Proveedor encontrado:', serviceProvider);
        res.json(serviceProvider);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener proveedor por ID' });
    }
}

export const getAllServiceProviders = async (_: Request, res: Response) => {
    console.log('Solicitud recibida para pedir todos los proveedor')
    try {
        const serviceProviders = await getServiceProviders();
        if (!serviceProviders) {
            console.log('No se encontraron proveedores')
            res.status(404).json({ message: 'No se encontraron proveedores' })
            return;
        }
        console.log('Proveedor encontrado:', serviceProviders);
        res.json(serviceProviders);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
}

export const createNewServiceProvider = async (req: Request, res: Response) => {
    try {
        const newProvider = await createServiceProvider(req.body, (req as any).userId);
        res.status(201).json(newProvider);
    } catch (error) {
        console.error("Controller createServiceProvider error:", error);
        res.status(500).json({ error: "No se pudo crear el proveedor" });
    }
}
/*
export const updateServiceProviderController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;       // ID del ServiceProvider en Mongo
        const payload = req.body;        // payload ya procesado por el middleware
        const userId = (req as any).user.id as string;

        // (Opcional) chequear que userId coincide con dueño del ServiceProvider, etc.

        const updated = await updateServiceProvider(id, payload);
        return res.status(200).json(updated);
    } catch (error) {
        console.error("Controller updateServiceProvider error:", error);
        return res.status(500).json({ error: "No se pudo actualizar el proveedor" });
    }
};*/
