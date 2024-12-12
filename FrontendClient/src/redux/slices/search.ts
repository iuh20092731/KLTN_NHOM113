import { createSlice } from '@reduxjs/toolkit';
import { fetchSearch } from '../thunks/search'; 

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    services: [],
    advertisements: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        state.advertisements = action.payload.advertisements;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
