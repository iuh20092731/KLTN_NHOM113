import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAdvertisementById, getAdvertimentByService, getAdverByUserId, likeAdvertisement } from '../thunks/advertisement';
import { Advertisement, AdvertisementV2 } from '../../types/Advertisement';

interface AdvertisementState {
  advertisement: AdvertisementV2 | null;
  advertisementsByService: Advertisement[];
  advertisementsByServiceV2: Record<number, Advertisement[]>;
  advertisementsByUserId: Advertisement[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdvertisementState = {
  advertisement: null,
  advertisementsByService: [],
  advertisementsByServiceV2: {},
  advertisementsByUserId: [],
  status: 'idle',
  error: null,
};

const advertisementSlice = createSlice({
  name: 'advertisement',
  initialState,
  reducers: {
    resetAdvertisementsByService: (state) => {
      state.advertisementsByService = [];
      state.status = 'idle';
      state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      // getAdvertisementById
      .addCase(getAdvertisementById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdvertisementById.fulfilled, (state, action: PayloadAction<AdvertisementV2>) => {
        state.status = 'succeeded';
        state.advertisement = action.payload;
        state.error = null;
      })
      .addCase(getAdvertisementById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An unknown error occurred';
      })
      // getAdvertimentByService
      .addCase(getAdvertimentByService.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdvertimentByService.fulfilled, (state, action: PayloadAction<Advertisement[]>) => {
        state.status = 'succeeded';
        state.advertisementsByService = action.payload;
        state.error = null;
      })
      .addCase(getAdvertimentByService.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An unknown error occurred';
      })


      .addCase(getAdverByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdverByUserId.fulfilled, (state, action: PayloadAction<Advertisement[]>) => {
        state.status = 'succeeded';
        state.advertisementsByUserId = action.payload;
        state.error = null;
      })
      .addCase(getAdverByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An unknown error occurred';
      })

      //like
      .addCase(likeAdvertisement.fulfilled, (state, action) => {
        const id = action.meta.arg;
        if (state.advertisement?.advertisementId === id) {
          state.advertisement.likes = (state.advertisement.likes || 0) + 1;
        }
      })
      .addCase(likeAdvertisement.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetAdvertisementsByService } = advertisementSlice.actions;
export default advertisementSlice.reducer;