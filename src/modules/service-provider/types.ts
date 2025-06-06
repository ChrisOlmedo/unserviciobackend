import { IImage } from '@shared/types';
import mongoose, { Document, Types } from "mongoose";


// ========== Start Base Interfaces ==========

export interface UserRef { userId: mongoose.Types.ObjectId; }

// ========== Media Interfaces ==========
export interface ServiceProviderMedia {
    logo: IImage;
    gallery: IImage[];
}

export interface ServiceProviderBase {
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
}
// ========== End Base Interfaces ==========


// ========== Mongoose Schema Interface ==========
export interface IServiceProvider extends ServiceProviderBase, UserRef, Document {
    logo: mongoose.Types.ObjectId; // Reference to IImage
    gallery: mongoose.Types.ObjectId[]; // References to IImage
    _id: mongoose.Types.ObjectId;
    canChangeEnterpriseName(): boolean;
    lastEnterpriseNameChange?: Date;
    slugHistory: {
        slug: string;
        changedAt: Date;
    }[];
}


// ========== Request Interface ==========

export interface ServiceProviderRequest extends ServiceProviderBase, ServiceProviderMedia, UserRef {
    newLogo: IImage;
    newGallery: IImage[];
    deletedImages: Types.ObjectId[];
}

// ========== Response Interfaces ==========
export interface ServiceProviderData extends ServiceProviderBase, ServiceProviderMedia { }