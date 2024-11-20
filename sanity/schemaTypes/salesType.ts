import { TagIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const salesType = defineType({
    name: "sale",
    title: "Sale",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            title: "Sale title",
            validation: (Rule) => Rule.required().min(5).max(100), // Optional validation
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Sale Description",
            description: "A brief description of the sale.",
        }),
        defineField({
            name: "discountAmount",
            type: "number",
            title: "Discount Amount",
            description: "The fixed amount to be discounted (in the currency of your choice).",
        }),
        defineField({
            name: "couponCode",
            type: "string",
            title: "Coupon Code",
            description: "The code that customers can use to avail of the discount.",
        }),
        defineField({
            name: "validFrom",
            type: "datetime",
            title: "Valid From",
            description: "The date and time when the coupon becomes valid.",
        }),
        defineField({
            name: "validUntil",
            type: "datetime",
            title: "Valid Until",
            description: "The date and time when the coupon expires.",
        }),
        defineField({
            name: "isActive",
            type: "boolean",
            title: "Is Active",
            description: "Indicates whether the sale is currently active.",
            initialValue: true, // Set default value to true
        }),
    ],
    preview: {
        select: {
            title: "title",
            description: "description",
            discountAmount: "discountAmount",
            isActive: "isActive",
        },
        prepare(selection) {
            const { title, description, discountAmount, isActive } = selection;
            return {
                title: title,
                subtitle: `${description || 'No description available'}`,
                media: isActive ? "Active" : "Inactive", // Use a checkmark or cross based on isActive
                description: `Discount: ${discountAmount || 0}`, // Adding discount amount to the preview
            }; 
        },
    },
});
