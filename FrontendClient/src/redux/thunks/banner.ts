import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api.service';
import { ENDPOINTS } from '../../constants/endpoints';
import { Banner2 } from '@/types/Banner2';



export const getAllBanners = createAsyncThunk(
  'banners/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<Banner2[]>(ENDPOINTS.BANNER2+"/RIGHT");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
