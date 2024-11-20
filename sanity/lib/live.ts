import "server-only";
 // Ensure this is the first import
import { defineLive } from "next-sanity";
import { createClient } from "next-sanity"; // Import createClient

// Define your Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION; // Make sure these are set correctly
const token = process.env.SANITY_READ_API_TOKEN;

// Check if the token is available
if (!token) {
    throw new Error("Missing SANITY_READ_API_TOKEN");
}

// Create the Sanity client
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Use CDN for faster delivery
});

// Define Live functionality with Sanity
export const { sanityFetch, SanityLive } = defineLive({
    client,
    serverToken: token,
    browserToken: token,
    fetchOptions: {
        revalidate: 0, // Set revalidation to 0 for immediate updates
    },
});
