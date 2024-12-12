// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { get } from '../../services/api.service';
// // import { MainAdvertisement } from '../../types/Advertisement';
// import { ENDPOINTS_V2 } from '../../constants/endpoints';
// import { AxiosError } from 'axios';

// interface TopRestaurantsParams {
//   serviceId: number;
//   limit?: number;
// }

// export const getTopRestaurants = createAsyncThunk(
//   'restaurants/getTop',
//   async ({ serviceId, limit = 10 }: TopRestaurantsParams, { rejectWithValue }) => {
//     try {
//       const response = await get<{ result: MainAdvertisement[] }>(
//         `${ENDPOINTS_V2.TOP_RESTAURANTS}?serviceId=${serviceId}&limit=${limit}`
//       );
//       return response.data.result;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//       return rejectWithValue('An unexpected error occurred');
//     }
//   }
// ); 