// import { createSlice } from '@reduxjs/toolkit';
// import { MainAdvertisement } from '../../types/Advertisement';
// import { getTopRestaurants } from '../thunks/topRestaurants';

// interface TopRestaurantsState {
//   restaurants: MainAdvertisement[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: TopRestaurantsState = {
//   restaurants: [],
//   status: 'idle',
//   error: null,
// };

// const topRestaurantsSlice = createSlice({
//   name: 'topRestaurants',
//   initialState,
//   reducers: {
//     clearTopRestaurants: (state) => {
//       state.restaurants = [];
//       state.status = 'idle';
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getTopRestaurants.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(getTopRestaurants.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.restaurants = [...state.restaurants, ...action.payload];
//         state.error = null;
//       })
//       .addCase(getTopRestaurants.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message ?? 'An unknown error occurred';
//       });
//   },
// });

// export const { clearTopRestaurants } = topRestaurantsSlice.actions;
// export default topRestaurantsSlice.reducer; 