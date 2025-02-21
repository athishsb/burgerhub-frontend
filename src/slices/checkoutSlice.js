import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        isProcessing: false,
        error: null,
        orderDetails: null, // Store order details after successful payment
    },
    reducers: {
        setProcessing: (state, action) => {
            state.isProcessing = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setOrderDetails: (state, action) => {
            state.orderDetails = action.payload;
        },
    },
});

export const {
    setProcessing,
    setError,
    setOrderDetails,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
