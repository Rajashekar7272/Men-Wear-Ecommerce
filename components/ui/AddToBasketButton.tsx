"use client";

import { Product } from "@/sanity.types";
import useBasketStore from "@/store";
import { useEffect, useState } from "react";

interface AddToBasketButtonProps {
    product: Product;
    disabled: boolean; // Indicates whether the product is out of stock or similar
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
    const { addItem, removeItem, getItemCount } = useBasketStore();
    const itemCount = getItemCount(product._id); // Get the current item count for the product

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Avoid rendering the component on the server side
    if (!isClient) {
        return null;
    }

    return (
        <div className="flex items-center justify-center space-x-2 border-2 border-blue-600 
        mb-2 bg-gray-300 rounded-sm">
            <span className="font-semibold mb-2 text-white bg-gradient-to-l mt-2
             from-purple-600 to-red-500 border-2 border-black rounded px-1 py-1">
                {itemCount > 0 ? "Added" : "Add to Basket"}
            </span>
            <button
                onClick={() => removeItem(product._id)} // This will now decrement the quantity
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    itemCount === 0
                        ? "bg-red-500 cursor-not-allowed opacity-50"
                        : "bg-red-500 hover:bg-red-600" // Red color for decrement
                }`}
                disabled={itemCount === 0 || disabled} // Disable button if count is 0 or product is disabled
            >
                <span className={`text-xl font-bold`}>
                    -
                </span>
            </button>
            <span className="w-8 text-center font-semibold">{itemCount}</span>
            <button
                onClick={() => addItem(product)} // This will add an item
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    disabled
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700"
                }`}
                disabled={disabled} // Disable button if product is disabled
            >
                <span className="text-xl font-bold text-white">+</span>
            </button>
        </div>
    );
}

export default AddToBasketButton;
