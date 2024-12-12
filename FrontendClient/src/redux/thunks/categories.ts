import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api.service';
import type { Category } from '../../types/Category';
import { ENDPOINTS } from '../../constants/endpoints';
// Fetch tất cả categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<{ result: Category[] }>(ENDPOINTS.CATEGORIES)
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch category theo tên
export const getCategoryByName = createAsyncThunk(
  'category/getByName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await get<{ result: Category }>(`${ENDPOINTS.CATEGORIES}/${name}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
