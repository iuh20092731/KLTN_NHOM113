import { createSlice } from '@reduxjs/toolkit';
import { trackClickThunk } from '../thunks/trackingClick';

interface ClickTrackingState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ClickTrackingState = {
  loading: false,
  success: false,
  error: null,
};

const clickTrackingSlice = createSlice({
  name: 'clickTracking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(trackClickThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(trackClickThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(trackClickThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clickTrackingSlice.reducer;
