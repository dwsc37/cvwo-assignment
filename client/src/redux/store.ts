import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import authMiddleware from "./authMiddleware";


const store = configureStore({
    reducer: {
        api: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware).concat(api.middleware),
})

setupListeners(store.dispatch)

export default store