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
    console.log('Solicitud recibida en /api/provider');
    const serviceProviderData = req.body;
    console.log(serviceProviderData)
    try {
        const serviceProvider = await createServiceProvider(serviceProviderData);
        console.log('Proveedor creado:', serviceProvider);
        res.json(serviceProvider);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ message: 'Error al crear proveedor' });
    }
}
