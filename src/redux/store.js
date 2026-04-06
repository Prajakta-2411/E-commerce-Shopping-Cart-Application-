import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
  },
});
