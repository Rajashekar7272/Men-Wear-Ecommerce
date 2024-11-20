"use client";

import AddToBasketButton from "@/components/ui/AddToBasketButton";
import useBasketStore from "@/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Loader from "@/components/ui/Loader";
import { createCheckOutSession, Metadata } from "@/actions/createCheckOutSession"; // Import the function correctly

function BasketPage() {
    const groupedItems = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Loader />;
    }

    if (groupedItems.length === 0) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">YOUR WARDROBE</h1>
                <p className="text-red-500 text-lg">Your Wardrobe is Empty</p>
            </div>
        );
    }

    const handleCheckOut = async () => {
        if (!isSignedIn) return; // Prevent execution if not signed in

        setIsLoading(true);
        try {
            const metadata: Metadata = {
                orderNumber: crypto.randomUUID(),
                customerName: user?.fullName ?? "Unknown",
                customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
                clerkUserId: user!.id,
            };

            const checkoutUrl = await createCheckOutSession(groupedItems, metadata);

            if (checkoutUrl) {
                window.location.href = checkoutUrl; // Redirect to checkout URL
            }

        } catch (error) {
            console.error("Error creating checkout session", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
            <div className="flex flex-col lg:flex-grow gap-8">
                <div className="flex-grow">
                    {groupedItems?.map((item) => (
                        <div key={item.product._id} className="mb-4 p-4 border rounded flex items-center justify-between">
                            <div
                                className="flex items-center cursor-pointer flex-1 min-w-0"
                                onClick={() => router.push(`/product/${item.product.slug?.current}`)}
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                                    {item.product.image && (
                                        <Image
                                            src={imageUrl(item.product.image).url()}
                                            alt={item.product.name ?? "product image"}
                                            className="w-full h-full object-cover rounded"
                                            width={96}
                                            height={96}
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                                        {item.product.name}
                                    </h2>
                                    <p>
                                        Price: ₹{((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center ml-4 md:ml-auto flex-shrink-0">
                                <AddToBasketButton product={item.product} disabled={false} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
                    <h3 className="text-xl font-semibold">Order Summary</h3>
                    <div className="mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Items</span>
                            <span>{groupedItems.reduce((total, item) => total + item.quantity, 0)}</span>
                        </p>
                        <p className="flex justify-between text-2xl font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>
                                ₹{useBasketStore.getState().getTotalPrice().toFixed(2)}
                            </span>
                        </p>
                    </div>

                    {isSignedIn ? (
                        <button
                            onClick={handleCheckOut}
                            disabled={isLoading}
                            className="mt-4 w-full bg-blue-500 text-white px-4 rounded hover:bg-blue-700 disabled:bg-gray-300"
                        >
                            {isLoading ? "Processing..." : "Checkout"}
                        </button>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Sign in to Checkout
                            </button>
                        </SignInButton>
                    )}
                </div>

                <div className="h-64 lg:h-0"></div>
            </div>
        </div>
    );
}

export default BasketPage;