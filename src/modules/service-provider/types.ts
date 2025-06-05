import { IImage } from '@shared/types';
import mongoose, { Document } from "mongoose";

export interface IServiceProvider extends Document {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userId: mongoose.Types.ObjectId;
    slug: string;
    enterpriseName: string;
    serviceCategories: string[];
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
    status: 'active' | 'inactive' | 'deleted';
    coverage: {
        maxDistance: number;
        cities: string[];
    };
    services: string[];
    aboutMe: string;
    lastNameChange?: Date;
    canChangeEnterpriseName: boolean;
    slugHistory: {
        slug: string;
        changedAt: Date;
    }[];
}

export interface ServiceProviderData extends IServiceProvider {
    logo: IImage;
    gallery: IImage[];
}