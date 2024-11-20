import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const getAllProductBySlug = async (slug: string) => {
    
    const PRODUCT_BY_ID_QUERY = defineQuery(`
        *[
        _type == "product" && slug.current == $slug
        ] | order(name asc) [0]
    `)

try {
    // Fetch the product data from Sanity using the query
    const product = await sanityFetch({
        query: PRODUCT_BY_ID_QUERY,
        params: { 
            slug,
        }, // Pass the slug parameter to the query
    });

    // Return the product if found, otherwise return null
    return product.data || null;
} catch (error) {
    console.error("Failed to fetch product by Id:", error);
    return null;
}
}