// import { createSlice } from '@reduxjs/toolkit';
// import { getTopRestaurants } from '../thunks/topRestaurants';
// import { MainAdvertisement } from '@/types/Advertisement';

// interface TopRestaurantsState {
//   restaurants: MainAdvertisement[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// export const topRestaurantsSlice = createSlice({
//   name: 'topRestaurants',
//   initialState: {
//     restaurants: [],
//     status: 'idle',
//     error: null
//   } as TopRestaurantsState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getTopRestaurants.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(getTopRestaurants.fulfilled, (state, action) => {
//         // Combine new restaurants with existing ones
//         state.restaurants = [...state.restaurants, ...action.payload];
//         state.status = 'succeeded';
//       })
//       .addCase(getTopRestaurants.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || null;
//       });
//   },
// }); 