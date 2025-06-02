import { IServiceProvider } from "../models/serviceProviderModel";
import { IImage } from "../models/imageModel";

export interface ServiceProviderData extends IServiceProvider {
    logo: IImage;
    gallery: IImage[];
}
