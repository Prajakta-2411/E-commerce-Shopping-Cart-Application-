import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get("https://dummyjson.com/products?limit=0");
    // dummyjson returns { products: [...], total, skip, limit }
    return response.data.products;
  },
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    return response.data;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    singleProduct: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      // All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })

      // Single product
      //   .addCase(fetchProductById.pending, (state) => {
      //     state.loading = true;
      //     state.singleProduct = null; // ✅ CLEAR OLD DATA
      //   })
      //   .addCase(fetchProductById.fulfilled, (state, action) => {
      //     state.singleProduct = action.payload;
      //   });

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.singleProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.singleProduct = action.payload; // ✅ set product
        state.loading = false; // ✅ STOP loading
      })

      .addCase(fetchProductById.rejected, (state) => {
        state.loading = false; // ✅ prevent infinite loading
      });
  },
});

export default productSlice.reducer;
