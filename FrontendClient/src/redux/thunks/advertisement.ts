import { createAsyncThunk } from "@reduxjs/toolkit";
import { del, get, post, put } from "../../services/api.service";
import { AdvertisementSchema, AdvertisementV2, Media, type Advertisement } from "../../types/Advertisement";
import { ENDPOINTS, ENDPOINTS_V2 } from "../../constants/endpoints";
import { ApiResponse, ApiResponseV2 } from "@/types/ApiResponse";
import { ZodError } from "zod";
import { z } from "zod";

type Advertisement1 = {
  mainAdvertisementName: string;
  serviceId: number;
  advertiserId: string;
  adminId: string;
  adStartDate: string; // ISO date string
  adEndDate: string; // ISO date string
  reviewNotes: string;
  description: string;
  detailedDescription: string;
  address: string;
  phoneNumber: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  openingHourStart: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  openingHourEnd: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  googleMapLink: string;
  websiteLink: string;
  adStatus: "Pending" | "Approved" | "Rejected";
  mediaList: Array<{
    name: string;
    content: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }>;
};

// Zod schema to validate the API response
const AdvertisementSchema1 = z.object({
  mainAdvertisementName: z.string(),
  serviceId: z.number(),
  advertiserId: z.string(),
  adminId: z.string(),
  adStartDate: z.string(),
  adEndDate: z.string(),
  reviewNotes: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  priceRangeLow: z.number(),
  priceRangeHigh: z.number(),
  openingHourStart: z.object({
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
    nano: z.number(),
  }),
  openingHourEnd: z.object({
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
    nano: z.number(),
  }),
  googleMapLink: z.string(),
  websiteLink: z.string(),
  adStatus: z.enum(["Pending", "Approved", "Rejected"]),
  mediaList: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
      url: z.string(),
      type: z.enum(["IMAGE", "VIDEO"]),
    })
  ),
});

export const getAdvertisementById = createAsyncThunk(
  "advertisement/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponseV2<AdvertisementV2>>(`${ENDPOINTS_V2.ADVERTISEMENT}/${id}`);
      return response.data.result;
    } catch (error: any) {
      console.error("Error in getAdvertisementById:", error);
      if (error instanceof ZodError) {
        return rejectWithValue(`Data validation error: ${error.errors.map(e => e.message).join(", ")}`);
      }
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);

export const getAdvertimentByService = createAsyncThunk(
  "advertisement/getByService",
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Advertisement[]>>(`${ENDPOINTS_V2.ADVERTISEMENT_BY_SERVICE}/${serviceId}`);
      const validatedResponse = AdvertisementSchema.array().parse(response.data.result);
      return validatedResponse;
    } catch (error: any) {
      console.error("Error in getAdvertimentByService:", error);
      if (error instanceof ZodError) {
        return rejectWithValue(`Data validation error: ${error.errors.map(e => e.message).join(", ")}`);
      }
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);

export const getAdvertimentByServiceV2 = createAsyncThunk(
  "advertisement/getByService",
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Advertisement[]>>(`${ENDPOINTS_V2.ADVERTISEMENT_BY_SERVICE}/${serviceId}`);
      const validatedResponse = AdvertisementSchema.array().parse(response.data.result);
      // Trả về dữ liệu với serviceId để lưu trữ dễ dàng trong state
      return { serviceId, advertisements: validatedResponse };
    } catch (error: any) {
      console.error("Error in getAdvertimentByService:", error);
      if (error instanceof ZodError) {
        return rejectWithValue(`Data validation error: ${error.errors.map(e => e.message).join(", ")}`);
      }
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);

export const postAdvertisement = createAsyncThunk(
  "advertisement/post",
  async (advertisementData: Advertisement1, { rejectWithValue }) => {
    try {
      // const response = await post<Advertisement1>(`${ENDPOINTS_V2.ADVERTISEMENT}`, advertisementData);
      const response = await post<Advertisement1>(`https://huyitshop.online/api/v2/main-advertisements`, advertisementData);
      const validatedResponse = AdvertisementSchema1.parse(response);
      return validatedResponse;
    } catch (error: any) {
      console.error("Error in postAdvertisement:", error);
      if (error instanceof ZodError) {
        return rejectWithValue(`Data validation error: ${error.errors.map(e => e.message).join(", ")}`);
      }
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);


export const getAdverByUserId = createAsyncThunk (
  "advertisement/getAdverByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await get<Advertisement[]>(`${ENDPOINTS.MANAGE_ADVERTISERMENT}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error in getAdvertimentByService:", error);
      if (error instanceof ZodError) {
        return rejectWithValue(`Data validation error: ${error.errors.map(e => e.message).join(", ")}`);
      }
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);

export const updateAdvertisement = createAsyncThunk(
  "advertisement/update",
  async (advertisementData: { id: number; data: Advertisement }, { rejectWithValue }) => {
    try {
      const response = await put<Advertisement>(`${ENDPOINTS.UPDATE_ADVERTISERMENT}/${advertisementData.id}`, advertisementData.data);
      return response.data;
    } catch (error: any) {
      console.error("Error in updateAdvertisement:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);


export const updateMediaAdvertisement = createAsyncThunk(
  "advertisement/updateMedia",
  async (mediaData: { mediaId: number; url: string }, { rejectWithValue }) => {
    try {
      const response = await put<string>(`${ENDPOINTS.MEDIA_ADVERTISEMENT}/${mediaData.mediaId}`, { url: mediaData.url });
      return response.data;
    } catch (error: any) {
      console.error("Error in updateMediaAdvertisement:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
);

export const deleteMediaAdvertisement = createAsyncThunk(
  "advertisement/deleteMedia",
  async (mediaId: number, { rejectWithValue }) => {
    try {
      const response =  await del<string>(`${ENDPOINTS.MEDIA_ADVERTISEMENT}/${mediaId}`);
      console.log("response: --- ", response);
      return response;
    } catch (error: any) {
      console.error("Error in deleteMediaAdvertisement:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
)

export const addMediaAdvertisement = createAsyncThunk(
  "advertisement/addMedia",
  async (mediaList: Media, { rejectWithValue }) => {
    try {
      const response =  await post<string>(`${ENDPOINTS.MEDIA_ADVERTISEMENT}`, mediaList);
      console.log("response: --- ", response);
      return response;
    } catch (error: any) {
      console.error("Error in deleteMediaAdvertisement:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "An unknown error occurred");
    }
  }
)



export const likeAdvertisement = createAsyncThunk(
  "advertisement/likeAdver",
  async(id: number, {rejectWithValue}) => {
    try {
      const response = await put(`${ENDPOINTS.UPDATE_ADVERTISERMENT}/${id}/like`)
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
)