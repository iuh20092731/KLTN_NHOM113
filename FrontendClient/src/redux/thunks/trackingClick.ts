import { ENDPOINTS } from '@/constants/endpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ClickTrackingParams {
  type: number;
  valueId: number;
}

export const trackClickThunk = createAsyncThunk(
  'clickTracking/trackClick',
  async ({ type, valueId }: ClickTrackingParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENDPOINTS.TRACKING_CLICK}`, {
        params: { type, valueId },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
