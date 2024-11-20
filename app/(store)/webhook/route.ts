import stripe from "@/lib/stripe"; // Stripe client initialized properly
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomUUID } from "crypto"; // Import crypto for randomUUID
import { backendClient } from "@/sanity/lib/backendClinet";
import { Metadata } from "@/actions/createCheckOutSession";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = req.headers; // Access headers and check for the Stripe signature
    const sig = headersList.get("stripe-signature");


    if (!sig) {
        return NextResponse.json({ error: "No Stripe signature found" }, { status: 400 });
    }

    // Retrieve the webhook secret from environment variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.log("Stripe webhook secret not set");
        return NextResponse.json(
            { error: "Stripe webhook secret not set" }, 
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    // Construct the event using the signature and secret
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error) {
        console.error("Webhook signature verification failed", error);
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${error}` },
            { status: 400 }
        );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const order = await createOrderInSanity(session);
            console.log("Order created in Sanity:", order);
        } catch (error) {
            console.error("Error creating Order in Sanity", error);
            return NextResponse.json(
                { error: "Error creating order" },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details,
    } = session;

    const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

    // Correct usage of stripe API to get line items
    const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
        expand: ["data.price.product"],
    });

    const sanityProducts = lineItemsWithProduct.data.map((item) => ({
        _key: randomUUID(), // Use crypto.randomUUID() for generating unique keys
        product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
        },
        quantity: item.quantity || 0,
    }));

    // Ensure the correct use of the backendClient to create an order
    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        customerEmail, // Include customerEmail if needed
        currency,
        clerkUserId, // Include clerkUserId if needed
        amountDiscount: total_details?.amount_discount
        ? total_details.amount_discount / 100
        : 0,
        products: sanityProducts, // Attach line items/products
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
    });

    return order;
}
