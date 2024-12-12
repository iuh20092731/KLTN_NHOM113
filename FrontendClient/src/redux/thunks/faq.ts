import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.service";
import { ENDPOINTS } from "../../constants/endpoints";
import { Faq } from "@/types/Faq";

export const getFaqsByAdvertimentId = createAsyncThunk(
  "faqs/getFaqsByAdvertimentId",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await get<{ code: number; result: Faq[] }>(ENDPOINTS.FAQS + `/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);