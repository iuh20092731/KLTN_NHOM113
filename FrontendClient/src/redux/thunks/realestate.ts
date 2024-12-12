// import { postRealEstate } from './realestate';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { post, get } from "../../services/api.service";
import { ENDPOINTS } from "../../constants/endpoints";
import { RealEstateListing, RealEstateMedia } from "@/types/RealEstateListing";
import axios from 'axios';

//post bản tin
export const postRealEstate = createAsyncThunk(
  "realestate/postRealEstate",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await post(ENDPOINTS.POST_REAL_ESTATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RealEstatePost {
  id(id: (id: any) => number): number;
  id(id: any): number;
  postId: number;
  postType: string;
  content: string;
  contactPhoneNumber: string | null;
  isAnonymous: boolean;
  createdAt: string;
  views: number;
  isNew: boolean;
  timeAgo: string;
}

export interface RealEstateListResponse {
  totalPost: number;
  list: RealEstatePost[];
}

export const getRealEstateListPaginated = createAsyncThunk(
  "realestate/getRealEstateListPaginated",
  async ({ page = 0, size = 10 }: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await get<RealEstateListResponse>(`${ENDPOINTS.POST_REAL_ESTATE}?page=${page}&size=${size}`);
      return {
        data: response.data.list,
        total: response.data.totalPost,
        page,
        size,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const increaseViewRealEstate = createAsyncThunk(
  "realestate/increaseViewRealEstate",
  async (ids: number[], { rejectWithValue }) => {
    try {
      const response = await post(ENDPOINTS.INCREASE_VIEW_REAL_ESTATE, ids);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getRealEstateListings = createAsyncThunk(
  "realestate/getRealEstateListings",
  async ({ realEstateType, page = 0, size = 5 }: { realEstateType: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await get<RealEstateListing[]>(`${ENDPOINTS.REAL_ESTATE_LISTING}/by-type?realEstateType=${realEstateType}&page=${page}&size=${size}`);
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const getRealEstateMediaById = createAsyncThunk(
  "realestate/getRealEstateMediaById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await get<RealEstateMedia[]>(`${ENDPOINTS.REAL_ESTATE_MEDIA}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

interface RealEstateListingPost {
  title: string;
  price: number;
  area: number;
  pricePerSquareMeter: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  detailedAddress: string | null;
  description: string;
  contactPhoneNumber: string;
};

export const postRealEstateListing = createAsyncThunk(
  "realestate/postRealEstateListing",
  async (realEstateListingData: RealEstateListingPost, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${ENDPOINTS.REAL_ESTATE_LISTING}`, realEstateListingData, {
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


export interface EstateMedia {
  mediaId: number;
  mediaUrl: string;
  mediaType: string;
  seq: number
}

export const postMediaEstate = createAsyncThunk(
  "realestate/postMediaEstate",
  async (formData: FormData, {rejectWithValue}) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ENDPOINTS.REAL_ESTATE_MEDIA}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          return { message: response.statusText || 'Upload failed' };
        });
        return rejectWithValue(errorData.message || 'Upload failed');
      }

      const data = await response.text();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);