import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const apiUrl = (import.meta as any).env.VITE_API_URL;

export const getAdvertisement = createAsyncThunk(
  'advertisement/getAdvertisement',
  async (advertisementId: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    try {
      const response = await axios.get(`${apiUrl}/api/v2/main-advertisements/${advertisementId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

