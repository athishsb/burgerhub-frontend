import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Fetch all orders (admin or authorized user can fetch all)
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BU}/payment/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders!');
        }
    }
);


// Update order status (admin or authorized user)
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status, token }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_BU}/payment/orders/${id}`,
                { orderStatus: status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status!');
        }
    }
);


const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update order status
        builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((order) => order._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                toast.success('Order status updated successfully!');
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
