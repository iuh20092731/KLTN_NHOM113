import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api.service';
import { ENDPOINTS, ENDPOINTS_V2 } from '../../constants/endpoints';
import { Advertisement, AdvertisementFull } from '@/types/Advertisement';
import { AxiosError } from 'axios';

export interface PaginationParams {
    page?: number;
    size?: number;
  }
export interface PaginatedResponse<T> {
    result(result: any): unknown;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    content: T[];
  }
export const getFavoriteAdvertisement = createAsyncThunk(
  'favoriteAdvertisement/get',
  async ({ page = 0, size = 9 }: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await get<PaginatedResponse<Advertisement>>(`${ENDPOINTS.FAVORITE_ADVERTISEMENT}?page=${page}&size=${size}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)


interface TopRestaurantsParams {
  serviceId: number;
  limit?: number;
}

export const getTopRestaurants = createAsyncThunk(
  'restaurants/getTop',
  async ({ serviceId, limit = 10 }: TopRestaurantsParams, { rejectWithValue }) => {
    try {
      const response = await get<{ result: AdvertisementFull[] }>(
        `${ENDPOINTS_V2.TOP_RESTAURANTS}?serviceId=${serviceId}&limit=${limit}`
      );
      return response.data.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
); 



// export const getTopRestaurant = createAsyncThunk(
//   'favoriteAdvertisement/getTopRestaurant',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await get<PaginatedResponse<AdvertisementFull[]>>(ENDPOINTS_V2.TOP_RESTAURANT);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }

//   }
// )

// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { get } from '../../services/api.service';
// import { ENDPOINTS_V2 } from '../../constants/endpoints';
// import { ApiResponse } from '@/types/ApiResponse';
// import { MainAdvertisement } from '@/types/Advertisement';

// export const getFavoriteAdvertisements = createAsyncThunk(
//   'favoriteAdvertisements/getAll',
//   async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
//     try {
//       const response = await get<ApiResponse<MainAdvertisement[]>>(
//         `${ENDPOINTS_V2.FAVORITE_ADVERTISEMENTS}/all?page=${page}&size=${size}`
//       );
//       return response.data.result;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// ); 