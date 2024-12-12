import { createSlice } from '@reduxjs/toolkit';
import { getServiceById } from '../thunks/service';

interface ServiceState {
  currentService: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  currentService: null,
  loading: false,
  error: null
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service';
      });
  },
});

export default serviceSlice.reducer; 