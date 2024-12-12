import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from '@/services/api.service';
import { ENDPOINTS } from "@/constants/endpoints";
import { FoodItem } from "@/types/Food";
import { ApiResponse } from "@/types/ApiResponse";
    
export const getTopFoodsThunk = createAsyncThunk<
  ApiResponse<FoodItem>,
  void,
  { rejectValue: string }
>(
  "food/getTopFoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<FoodItem>>(ENDPOINTS.TOP_FOOD);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);