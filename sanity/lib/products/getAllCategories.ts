import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {

    const ALL_CATEGORIES_QUERY = defineQuery(`
        *[
            _type == "category"
        ] | order(name asc)
            `);

try {
    const categories = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
    });
    
    return categories.data || []; // Return the fetched categories
} catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories"); // Rethrow or handle the error as needed
    return [];
}
}