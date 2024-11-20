// store/basketStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './sanity.types';

export interface BasketItem {
    product: Product;
    quantity: number; // quantity is retained for managing item counts
}

interface BasketState {
    items: BasketItem[]; // Array to hold basket items
    totalItems: number; // Total number of items in the basket
    totalPrice: number; // Total price of items in the basket
    addItem: (product: Product) => void; // Method to add an item
    removeItem: (productId: string) => void; // Method to remove an item or decrement quantity
    clearBasket: () => void; // Method to clear the basket
    getTotalPrice: () => number; // Method to calculate total price
    getItemCount: (productId: string) => number; // Method to get the quantity of a specific product
    getGroupedItems: () => BasketItem[]; // Method to get grouped items
}

// Create the Zustand store
const useBasketStore = create<BasketState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0, // Initialize totalPrice
            addItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.product._id === product._id);
                if (existingItem) {
                    // Increase quantity if item already exists
                    const newItems = state.items.map(item =>
                        item.product._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                    const newTotalItems = state.totalItems + 1;
                    const newTotalPrice = get().getTotalPrice() + (product.price ?? 0);
                    return { items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
                } else {
                    // Add new item to the basket with quantity 1
                    const newItems = [...state.items, { product, quantity: 1 }];
                    const newTotalItems = state.totalItems + 1;
                    const newTotalPrice = get().getTotalPrice() + (product.price ?? 0);
                    return { items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
                }
            }),
            removeItem: (productId) => set((state) => {
                const itemToUpdate = state.items.find(item => item.product._id === productId);
                if (itemToUpdate) {
                    if (itemToUpdate.quantity > 1) {
                        // Decrease quantity instead of removing
                        const newItems = state.items.map(item =>
                            item.product._id === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        );
                        const newTotalItems = state.totalItems - 1;
                        const newTotalPrice = get().getTotalPrice() - (itemToUpdate.product.price ?? 0);
                        return { items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
                    } else {
                        // Remove item if quantity is 1
                        const newItems = state.items.filter(item => item.product._id !== productId);
                        const newTotalItems = state.totalItems - 1;
                        const newTotalPrice = get().getTotalPrice() - (itemToUpdate.product.price ?? 0);
                        return { items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
                    }
                }
                return state; // Return current state if item is not found
            }),
            clearBasket: () => set({ items: [], totalItems: 0, totalPrice: 0 }), // Clear basket
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0);
            },
            getItemCount: (productId) => {
                const item = get().items.find(item => item.product._id === productId);
                return item ? item.quantity : 0; // Return quantity or 0 if not found
            },
            getGroupedItems: () => get().items, // Return items directly
        }),
        {
            name: 'basket-storage', // Name of the item in local storage
        }
    )
);

export default useBasketStore;
