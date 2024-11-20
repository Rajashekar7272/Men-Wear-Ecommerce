import { sanityFetch } from "../lib/live";
import { CouponCode } from "./couponCodes";
import { defineQuery } from "next-sanity"; // Ensure you have this import for your queries


export const getActiveSaleByCouponCode = async ( couponCode: CouponCode) => {
    const ACTIVE_SALE_QUERY = defineQuery(`*[
        _type == "sale" && isActive == true
        && couponCode == $couponCode &&
        (validUntil > now() || !defined(validUntil))
      ] | order(validFrom desc)[0]
      `);

try {
    // Fetch data from the Sanity client with the provided coupon code
    const result = await sanityFetch({
        query: ACTIVE_SALE_QUERY,
        params: {
            couponCode,
        }
    });
    const activeSale = result?.["data"]; // Assuming the result is an array
        return activeSale || null; 
    
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Failed to fetch active sale by coupon code:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}