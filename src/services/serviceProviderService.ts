import ServiceProvider, { IServiceProvider } from '../models/serviceProviderModel';

export async function createServiceProvider(ServiceproviderData: IServiceProvider) {
    const Serviceprovider = await ServiceProvider.create(ServiceproviderData);
    return Serviceprovider;
}

export async function getServiceProviderBySlug(slug: string) {
    return await ServiceProvider.findOne({ slug });
}

export async function getServiceProviders() {
    return await ServiceProvider.find({}).select('_id name slug');
}

export async function getServiceProviderByUserId(userId: string) {
    return await ServiceProvider.findOne({ userId });
}