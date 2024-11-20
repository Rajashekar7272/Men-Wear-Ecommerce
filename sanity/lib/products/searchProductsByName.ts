import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParam: string) => {
    const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
    _type == "product" 
    && name match $searchParam
    ] | order(name asc)
        `);

try {
    // Fetch the products from Sanity using the query
    const products = await sanityFetch({
        query: PRODUCT_SEARCH_QUERY,
        params: { searchParam: `${searchParam}*` }, // Passing the search parameter to the query
    });

    // Return the list of products if available, otherwise null
    return products || [];
} catch (error) {
    // Log the error if the fetch fails
    console.error("Failed to search products by name:", error);
    throw error; // Optionally rethrow the error for further handling
}}