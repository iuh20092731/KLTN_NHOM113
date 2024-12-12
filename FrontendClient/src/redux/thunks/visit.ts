import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.service";
import { ENDPOINTS } from "../../constants/endpoints";

export const getTotalVisit = createAsyncThunk(
  "visit/total",
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<number>(ENDPOINTS.TOTAL_VISITS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const incrementVisit = createAsyncThunk(
  "visit/increment",
  async (_, { rejectWithValue }) => {
    try {
      await get<number>(ENDPOINTS.INC_VISITS);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
