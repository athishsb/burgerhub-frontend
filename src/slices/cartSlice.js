import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],

};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { burger, quantity, variant } = action.payload;

            // Find the existing item in the cart
            const existingItem = state.cartItems.find(
                item => item._id === burger._id && item.variant === variant
            );

            // If the item exists in the cart, update its quantity and price
            if (existingItem) {
                existingItem.quantity += quantity;

                // If the updated quantity exceeds 10, set it to 10 and notify the user
                if (existingItem.quantity > 10) {
                    existingItem.quantity = 10;
                    toast.error('You can only have up to 10 items of the same variant in the cart.');
                    return
                }

                // Only update price if quantity is still greater than 0
                if (existingItem.quantity <= 0) {
                    // Remove item if quantity goes to 0 or less
                    state.cartItems = state.cartItems.filter(item => item._id !== burger._id);
                    toast.info('Item removed from cart.');
                } else {
                    existingItem.price = existingItem.prices[0][variant] * existingItem.quantity;
                    toast.success('Item quantity updated!');
                }
            } else if (quantity > 0) {
                // If it's a new item, add it to the cart only if quantity is positive
                const cartItem = {
                    _id: burger._id,
                    name: burger.name,
                    image: burger.image,
                    prices: burger.prices,
                    variant,
                    quantity,
                    price: burger.prices[0][variant] * quantity,
                };
                state.cartItems.push(cartItem);
                toast.success('Item added to cart!');
            }

            // Update localStorage with the latest cartItems
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            // Remove item based on both _id and variant (size)
            const updatedCartItems = state.cartItems.filter(
                item => item._id !== action.payload._id || item.variant !== action.payload.variant
            );
            state.cartItems = updatedCartItems;

            // Update localStorage after item removal
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            toast.info('Item removed from cart.');
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },

    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;


