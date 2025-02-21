import { configureStore } from "@reduxjs/toolkit";
import burgerReducer from './slices/burgerSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {
        burgers: burgerReducer,
        cart: cartReducer,
        user: userReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
    }
});

export default store;