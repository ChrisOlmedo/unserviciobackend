
import { Request, Response, NextFunction } from 'express';
import { safeParse } from '@shared/utils/dataParser';

export const parseServiceProviderData = (req: Request, _res: Response, next: NextFunction) => {
    req.body = {
        ...req.body,
        logo: safeParse(req.body.logo, null),
        serviceCategories: safeParse(req.body.serviceCategories, []),
        coverage: safeParse(req.body.coverage, { maxDistance: 0, cities: [] }),
        services: safeParse(req.body.services, []),
        gallery: safeParse(req.body.gallery, []),
    };
    next();
};

