// src/store/store.js
"use client";
import userReducer from "./userSlice";
import curEventReducer from "./curEventSlice";  // Ensure the correct file name is used here

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        user: userReducer,
        curEvent: curEventReducer  // Corrected to use curEventReducer
    }
});

export default store;
