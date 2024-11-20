"use client";

import { Button } from "@/components/ui/button";
import useBasketStore from "@/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function SuccessPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");
    const clearBasket = useBasketStore((state) => state.clearBasket);

    useEffect(() => {
        if (orderNumber) {
            clearBasket();
        }
    }, [orderNumber, clearBasket]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        {/* SVG Tick Mark */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-green-500" // Adjust size and color as needed
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 12l4 4L18 8" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-6 text-center">
                    Thank You For Your Order
                </h1>
                <p className="text-lg text-center text-gray-700 mb-4">
                    Your order has been confirmed and will be shipped shortly!
                </p>
                <span className="font-mono text-sm text-green-500 text-center">
                    order Number = {orderNumber}
                </span>
                <p className="text-lg text-center text-gray-700 mb-6">
                    A confirmation email has been sent to your registered email ID.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href='/orders'>View Your Order Details</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href='/'>Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;
