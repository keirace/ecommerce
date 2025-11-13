const getSlug = (params: Record<string, string | string[] | undefined>, name: string): string[] => {
    if (!params[name as keyof NormalizedProductFilters]) {
        return [];
    }
    return Array.isArray(params[name as keyof NormalizedProductFilters]) ? (params[name as keyof NormalizedProductFilters] as string[]) : [params[name as keyof NormalizedProductFilters] as string];
};

export const normalizeProductFilters = (params: Record<string, string | string[] | undefined>): NormalizedProductFilters => {
    const normalizedFilters: NormalizedProductFilters = {};

    if (params.search) {
        normalizedFilters.search = params.search as string;
    }

    normalizedFilters.categories = getSlug(params, "category");
    normalizedFilters.genders = getSlug(params, "gender");
    normalizedFilters.colors = getSlug(params, "color");
    normalizedFilters.sizes = getSlug(params, "size");
    normalizedFilters.brands = getSlug(params, "brand");

    if (params['price range']) {
        const p = params['price range'];
        if (p === '$0 - $50') {
            normalizedFilters.minPrice = '0';
            normalizedFilters.maxPrice = '50';
        } else if (p === '$51 - $100') {
            normalizedFilters.minPrice = '51';
            normalizedFilters.maxPrice = '100';
        } else if (p === 'over $100') {
            normalizedFilters.minPrice = '101';
        }
    }

    if (params.sort) {
        normalizedFilters.sort = params.sort as "price-asc" | "price-desc" | "newest";
    }

    if (params.pages) {
        normalizedFilters.pages = params.pages ? parseInt(params.pages as string, 10) : 1;
    }

    if (params.limit) {
        normalizedFilters.limit = params.limit ? parseInt(params.limit as string, 10) : 10;
    }

    return normalizedFilters;
};