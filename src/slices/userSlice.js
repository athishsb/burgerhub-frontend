import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BU}/users/register`,
                userData
            );
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data;

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Registration Failed!';
            return rejectWithValue(errorMsg);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BU}/users/login`,
                credentials
            );
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Login Failed!';
            return rejectWithValue(errorMsg);
        }
    }
);



// Fetch users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BU}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users!');
        }
    }
);


// Delete user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async ({ userId, token }, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BU}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user!');
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
        users: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearUser: (state) => {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        // Register User
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
                toast.success('User Registered!');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1200);

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            });

        // Login User
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
                toast.success('Logged In!');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1200);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            });

        // Handling fetch users
        builder.addCase(fetchUsers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Handling delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            // Remove the deleted user from the list
            state.users = state.users.filter((user) => user._id !== action.payload);
            toast.success('User and associated orders deleted successfully');
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        });
    },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
