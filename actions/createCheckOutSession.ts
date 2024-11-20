"use server";

import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
}

export type GroupedBasketItem = {
    product: BasketItem["product"];
    quantity: number;
}

// Fix the function signature to accept parameters
export async function createCheckOutSession(
    items: GroupedBasketItem[],  // Added parameter type declaration
    metadata: Metadata            // Added parameter type declaration
) {
    try {
        const itemsWithoutPrice = items.filter((item) => !item.product.price);
        if (itemsWithoutPrice.length > 0) {
            throw new Error("Some items do not have price");
        }

        // Fetch customers by email to see if the user is already a customer
        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });

        let customerId: string | undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id; // Use existing customer ID
        }

        const baseUrl = process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`;

        const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`

        const cancelUrl = `${baseUrl}/basket`;        
        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "INR", // Correct currency code
                    product_data: {
                        name: item.product.name || "Unnamed Product", // Fallback name
                        description: `Product ID: ${item.product._id}`, // Description with product ID
                        metadata: {
                            id: item.product._id, // Include product ID in metadata
                        },
                        images: item.product.image // Fix: access the image correctly
                            ? [imageUrl(item.product.image).url()]
                            : undefined,
                    },
                    unit_amount: Math.round(item.product.price! * 100), // Ensure price is multiplied by 100 for cents
                },
                quantity: item.quantity,
            })),
        });

        // Return the session URL for redirection
        return session.url; 
    } catch (error) {
        console.error("Error creating checkout session", error);
        throw new Error("Failed to create checkout session"); // Rethrow the error after logging
    }
}
