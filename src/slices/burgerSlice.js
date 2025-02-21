import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Fetch all burgers
export const fetchBurgers = createAsyncThunk(
    "burgers/fetchBurgers",
    async ({ search = "", category = "" }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BU}/burgers/getAllBurgers?search=${search}&category=${category}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch burgers!");
        }
    }
);


// Get a single burger by ID
export const getBurgerById = createAsyncThunk(
    "burgers/getBurgerById",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BU}/burgers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch burger!");
        }
    }
);


// Add a new burger
export const addBurger = createAsyncThunk(
    "burgers/addBurger",
    async ({ burgerData, token }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BU}/burgers`,
                burgerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add burger!");
        }
    }
);


// Update an existing burger
export const updateBurger = createAsyncThunk(
    "burgers/updateBurger",
    async ({ id, burgerData, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BU}/burgers/update/${id}`,
                burgerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update burger!");
        }
    }
);


// Delete a burger
export const deleteBurger = createAsyncThunk(
    "burgers/deleteBurger",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BU}/burgers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete burger!");
        }
    }
);


const burgerSlice = createSlice({
    name: 'burgers',
    initialState: {
        items: [],
        selectedBurger: null,
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            // Fetch burgers
            .addCase(fetchBurgers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBurgers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBurgers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch burgers.";
                toast.error(state.error);
            })

            // Get burger by ID
            .addCase(getBurgerById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBurgerById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBurger = action.payload;
            })
            .addCase(getBurgerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch burger.";
                toast.error(state.error);
            })

            // Add a new burger
            .addCase(addBurger.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBurger.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                toast.success("Burger added successfully!");
            })
            .addCase(addBurger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to add burger.";
                toast.error(state.error);
            })

            // Update burger
            .addCase(updateBurger.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBurger.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map((burger) =>
                    burger._id === action.payload._id ? action.payload : burger
                );
                toast.success("Burger updated successfully!");
            })
            .addCase(updateBurger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update burger.";
                toast.error(state.error);
            })

            // Delete burger
            .addCase(deleteBurger.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBurger.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(burger => burger._id !== action.payload);
                toast.success("Burger deleted successfully!");
            })
            .addCase(deleteBurger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete burger.";
                toast.error(state.error);
            });
    },
});

export default burgerSlice.reducer;
