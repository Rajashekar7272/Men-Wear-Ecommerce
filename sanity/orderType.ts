import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField } from "sanity";

export const orderType = defineField({
    name: "order",
    title: "Order",
    type: "document",
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string",
        }),
        defineField({
            name: "stripePaymentIntentId",
            title: "Stripe Payment Intent ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "clerkUserId",
            title: "Clerk User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerEmail",
            title: "Customer Email",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscount",
            title: "Amount Discount",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Paid", value: "paid" },
                    { title: "Delivered", value: "delivered" },
                    { title: "Shipped", value: "shipped" },
                    { title: "Cancelled", value: "cancelled" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "orderDate",
            title: "Order Date",
            type: "datetime", // Use `datetime` type for the order date
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            title: "Products bought",
                            type: "reference",
                            to:[{ type: "product"}],
                        }),
                        
                        defineField({
                            name: "quantity",
                            title: "Quantity Purchased",
                            type: "number",
                            validation: (Rule) => Rule.min(1).required(),
                        }),
                    ],
                    preview: {
                        select: {
                            product: "product.name",
                            quantity: "quantity",
                        },
                        prepare(selection) {
                            const { product, quantity } = selection;
                            return {
                                title: `${product} x ${quantity}`,
                            };
                        },
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: {
            name: "product.name",
            orderId: "orderNumber",
            image: "product.image",
            amount: "totalPrice",
            currency: "currency",
            status: "status",
            email: "customerEmail",
        },
        prepare(selection) {
            const { name, orderId, amount, currency, status, email, image } = selection;
            const orderIdSnippet = orderId.length > 10 ? `${orderId.slice(0, 5)}...${orderId.slice(-5)}` : orderId;
            return {
                title: `Order for ${email} - ${orderIdSnippet}`,
                subtitle: `Total: ${amount} ${currency} | Status: ${status} | Email: ${email}`,
                media: selection.image,
            };
        },
    },
});
