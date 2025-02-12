import Provider, { IProvider } from '../models/providerModel';

export async function createProvider(providerData: IProvider) {
    const provider = await Provider.create(providerData);
    console.log('Provider creado:', provider);
    return provider;
}

export async function getProvider(filter: Record<string, any>) {
    return await Provider.findOne(filter);
}