import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.service";
import { ServiceSchema, type Service } from "../../types/Service";
import { ApiResponse, ApiResponseV2 } from "../../types/ApiResponse";
import { ENDPOINTS, ENDPOINTS_V2 } from "../../constants/endpoints";

export const getServiceByName = createAsyncThunk(
  "service/getByName",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service[]>>(`${ENDPOINTS.SERVICE}?categoryName=${categoryName}`);
      const validatedResponse = ServiceSchema.array().parse(response.data.result);
      return validatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getServiceByNameCategory = createAsyncThunk(
  "service/getByNameCategory",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponseV2<Service[]>>(`${ENDPOINTS_V2.SERVICE_V2}?categoryName=${categoryName}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getServiceById = createAsyncThunk(
  "service/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service[]>>(`${ENDPOINTS.SERVICE_BY_ID}/${id}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)