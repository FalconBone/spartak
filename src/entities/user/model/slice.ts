import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import { jwtDecode } from "jwt-decode";


const initialState: AuthState = {
    role: null,
    isAuthenticated: false,
    accessToken: null,
    language: 'ru'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeAccessToken: (state) => {
            state.accessToken = null
        },
        setAuth: (state, {payload}) => {
            //state.role = payload.
            
        }
    },
})

export const {removeAccessToken} = authSlice.actions