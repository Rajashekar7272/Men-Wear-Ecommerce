import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export async function getMyOrders(userId: string) {
    if(!userId){
        throw new Error("User Id Required");
    }


    const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
        ...,
        products[]{
            ...,
            product->
        }
    }
        `);

        try {
            const orders = await sanityFetch({
                query: MY_ORDERS_QUERY,
                params: { userId },
            });
            return orders;
        } catch (error) {
            console.error("Errror Fetching Your Orders", error);
            throw new Error("Error Fetching Orders")
        }
}