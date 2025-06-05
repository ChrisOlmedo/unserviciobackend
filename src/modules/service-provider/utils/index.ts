

export async function generateSlug(enterpriseName: string): Promise<string> {
    const baseSlug = enterpriseName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Elimina tildes
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    slug = baseSlug

    return slug;
}   