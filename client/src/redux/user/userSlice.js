import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        changePasswordStart: (state) => {
            state.loading = true;
        },
        changePasswordSuccess: (state) => {
            state.loading = false;
            state.error = false;
        },
        changePasswordFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        updateUser(state, action) {
            state.currentUser = { ...state.currentUser, ...action.payload };
        },
        updateUserDetails: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                ...action.payload,
            };
        },
    }
});


export const { signInStart, signInSuccess, signInFail, updateUserStart, updateUserSuccess, updateUserFail, deleteUserStart, deleteUserSuccess, deleteUserFail, signOut, changePasswordStart, changePasswordSuccess, changePasswordFail, updateUser, setUser, updateUserDetails } = userSlice.actions;

export default userSlice.reducer;