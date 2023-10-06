import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
        order: orderReducer
    },
});

/* // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch */
