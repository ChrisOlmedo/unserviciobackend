import { Request, Response } from 'express';
import { createProvider, getProviderBySlug, getProviders } from '../services/providerService';



export const getProvider = async (req: Request, res: Response) => {
    console.log('Solicitud recibida de proveedor')

    const { slug } = req.params
    console.log(slug)
    try {
        const provider = await getProviderBySlug({ slug });
        if (!provider) {
            console.log('Proveedor no encontrado')
            res.status(404).json({ message: 'Proveedor no encontrado' })
            return;
        }
        console.log('Proveedor encontrado:', provider);
        res.json(provider);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener proveedor por ID' });
    }
}


export const getAllProviders = async (_: Request, res: Response) => {
    console.log('Solicitud recibida para pedir todos los proveedor')

    try {
        const provider = await getProviders();
        if (!provider) {
            console.log('No se encontraron proveedores')
            res.status(404).json({ message: 'No se encontraron proveedores' })
            return;
        }
        console.log('Proveedor encontrado:', provider);
        res.json(provider);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
}

export const createNewProvider = async (req: Request, res: Response) => {

    console.log('Solicitud recibida en /api/provider');
    const providerData = req.body;
    console.log(providerData)
    try {
        const provider = await createProvider(providerData);
        console.log('Proveedor creado:', provider);
        res.json(provider);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ message: 'Error al crear proveedor' });
    }
}
