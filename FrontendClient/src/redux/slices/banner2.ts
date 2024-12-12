import { createSlice } from '@reduxjs/toolkit';
import { getAllBanners } from '../thunks/banner';
import { Banner2 } from '@/types/Banner2';

interface Banner2State {
  banners: Banner2[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: Banner2State = {
  banners: [],
  status: 'idle',
  error: null,
};

const banner2Slice = createSlice({
  name: 'banner2',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getAllBanners.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getAllBanners.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.banners = action.payload;
        })
        .addCase(getAllBanners.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Error fetching banners';
        });
  },
});

export default banner2Slice.reducer;
