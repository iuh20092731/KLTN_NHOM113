// advertisementSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';



export interface Media {
  name: string;
  content: string;
  url: string;
  type: string;
}

export interface Advertisement {
  mainAdvertisementName: string;
  serviceId: number;
  advertiserId: string;
  adminId: string;
  adStartDate: string;
  adEndDate: string;
  description: string;
  detailedDescription: string;
  address: string;
  phoneNumber: string;
  priceRangeLow: string;
  priceRangeHigh: string;
  openingHourStart: string;
  openingHourEnd: string;
  googleMapLink: string;
  websiteLink: string;
  adStatus: string;
  mediaList: Media[];
}

interface AdvertisementState {
  advertisement: Advertisement | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdvertisementState = {
  advertisement: null,
  loading: false,
  error: null,
};
const apiUrl = (import.meta as any).env.VITE_API_URL;
export const createAdvertisement = createAsyncThunk(
  'advertisement/create',
  async (advertisementData: Advertisement, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    try {
      const response = await axios.post(`${apiUrl}/api/v2/main-advertisements`, advertisementData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const advertisementSlice = createSlice({
  name: 'advertisement',
  initialState,
  reducers: {
    resetAdvertisement(state) {
      state.advertisement = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdvertisement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.loading = false;
        state.advertisement = action.payload;
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdvertisement } = advertisementSlice.actions;
export default advertisementSlice.reducer;
