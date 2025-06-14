import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('0123456789', 6);
import ServiceProvider from '../model'

export async function generateUniqueSlug(enterpriseName: string): Promise<string> {
    const baseSlug = enterpriseName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    let slug: string;
    let exists: boolean;

    do {
        const id = nanoid(); // 6 dígitos numéricos
        slug = `${baseSlug}-${id}`;
        exists = !!(await ServiceProvider.exists({ slug }));
    } while (exists);

    return slug;
}
