// Helper para parsear JSON (strings o arrays)
export const parseJSONField = (input: any): any => {
    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch {
            return null; // o [] si se espera un array
        }
    }
    return input; // Si ya es objeto, no hacer nada
};

export const safeParse = <T>(input: any, defaultValue: T): T => {
    if (typeof input === 'string') {
        try {
            return JSON.parse(input) as T;
        } catch {
            return defaultValue;
        }
    }
    return input || defaultValue;
};