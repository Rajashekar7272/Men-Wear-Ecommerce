import { TrolleyIcon } from "@sanity/icons"; // Correct import
import { defineField, defineType } from "sanity"; // Removed unused 'prepareConfig' and 'prepare'

export const productType = defineType({
    name: 'product',
    title: 'Products', // Updated title to follow consistent capitalization
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: "name",
            title: "Product Name",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "image",
            title: "Product Image",
            type: "image",
            options: {
                hotspot: true,
            }
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "blockContent", // Ensure 'blockContent' is defined in your schema
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: [{ type: "category" }] }], // Corrected to match expected format
        }),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: 'name', // Use the name field to generate the slug
                maxLength: 96, // Limit the length of the slug
                slugify: input => input
                    .toLowerCase()
                    .replace(/\s+/g, '-') // Replace spaces with dashes
                    .slice(0, 96), // Limit the length of the slug
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "name",
            media: "image",
            price: "price",
        },
        prepare(selection) { // Corrected to use 'selection' instead of 'select'
            const { title, media, price } = selection; // Destructured selection for clarity
            return {
                title,
                subtitle: price ? `$${price}` : 'Price not set', // Provides a default if price is not set
                media,
            };
        },
    },
});
