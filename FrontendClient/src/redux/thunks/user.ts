import { UpdateUserResponseSchema } from './../../types/User';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { get, put } from "../../services/api.service";
import { UserInfoResponse } from "../../types/User";
import { ENDPOINTS } from "../../constants/endpoints";
export const getUserInfo = createAsyncThunk(
    "auth/userInfo",
    async (_, { rejectWithValue }) => {
      try {
        const response = await get<UserInfoResponse>(ENDPOINTS.USER_INFO);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );


export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, data }: { userId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await put<typeof UpdateUserResponseSchema>(`${ENDPOINTS.UPDATE_USER}/${userId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)
  
