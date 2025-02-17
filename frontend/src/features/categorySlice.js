import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories} from "../api/categoryApi";

export const fetchCategories = createAsyncThunk("category/fetch", async (token) => {
  const response = await getCategories(token);
  return response.data;
});

const categorySlice = createSlice({
  name: "category",
  initialState: { categories: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
