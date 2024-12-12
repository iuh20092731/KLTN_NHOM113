import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const apiUrl = (import.meta as any).env.VITE_API_URL;

export const getAllAdvertisers = createAsyncThunk(
  'advertiser/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;
      
      const response = await axios.get(`${apiUrl}/api/v2/advertisers`, {
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