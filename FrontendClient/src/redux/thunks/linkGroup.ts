import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.service";
import { ENDPOINTS } from "../../constants/endpoints";
import { LinkGroup } from "@/types/LinkGroup";

export const getLinkGroup = createAsyncThunk(
    'getLinkGroup/getAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await get<{ result: LinkGroup[] }>(ENDPOINTS.LINK_GROUP)
        return response.data.result;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );