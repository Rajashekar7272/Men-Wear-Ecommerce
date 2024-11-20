import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url"; // Correct import for the builder
import { SanityImageSource } from "@sanity/image-url/lib/types/types"; // Keep the import for the image source type

const builder = imageUrlBuilder(client); // Initialize the image URL builder

/**
 * Generates a URL for the provided Sanity image source.
 * 
 * @param {SanityImageSource} source - The Sanity image source
 * @returns {string} - The generated image URL
 */
export function imageUrl(source: SanityImageSource) {
    return builder.image(source); // Call .url() to get the URL as a string
}
