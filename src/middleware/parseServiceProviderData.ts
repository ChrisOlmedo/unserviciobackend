
import { Request, Response, NextFunction } from 'express';
import { safeParse } from '../utils/dataParser';

export const parseServiceProviderData = (req: Request, _res: Response, next: NextFunction) => {
    req.body = {
        ...req.body,
        serviceCategories: safeParse(req.body.serviceCategories, []),
        coverage: safeParse(req.body.coverage, { maxDistance: 0, cities: [] }),
        services: safeParse(req.body.services, [])
    };
    next();
};
