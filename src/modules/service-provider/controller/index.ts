import { Request, Response } from 'express';
import { getServiceProviderBySlug, getServiceProviders, getServiceProviderByUserId } from '../service';
import registerServiceProvider from '../service/create.service';
import updateServiceProvider from '../service/update.service';

export const getPublicServiceProvider = async (req: Request, res: Response) => {
    console.log('Solicitud recibida de proveedor para public')
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
    console.log('Solicitud recibida de proveedor para sus datos')
    const userId = (req as any).userId;
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
        const newProvider = await registerServiceProvider(req.body, (req as any).userId);
        res.status(201).json(newProvider);
    } catch (error) {
        console.error("Controller createServiceProvider error:", error);
        res.status(500).json({ error: "No se pudo crear el proveedor" });
    }
}

export const updateServiceProviderController = async (req: Request, res: Response) => {
    try {
        const updated = await updateServiceProvider(req.body, (req as any).userId);

        console.log("Proveedor actualizado:", updated);
        res.status(200).json(updated);
    } catch (error) {
        console.error("Controller updateServiceProvider error:", error);
        res.status(500).json({ error: "No se pudo actualizar el proveedor" });
    }
};
