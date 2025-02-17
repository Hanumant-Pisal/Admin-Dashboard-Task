import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSubCategories } from "../api/subCategoryApi";

export const fetchSubCategories = createAsyncThunk("subCategory/fetch", async (token) => {
  const response = await getSubCategories(token);
  return response.data;
});

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: { subCategories: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subCategorySlice.reducer;
