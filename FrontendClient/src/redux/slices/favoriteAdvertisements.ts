// import { createSlice } from '@reduxjs/toolkit';
// import { getFavoriteAdvertisements } from '../thunks/favoriteAdvertisements';
// import { MainAdvertisement } from '@/types/Advertisement';

// interface FavoriteAdvertisementsState {
//   items: MainAdvertisement[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: FavoriteAdvertisementsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };

// const favoriteAdvertisementsSlice = createSlice({
//   name: 'favoriteAdvertisements',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getFavoriteAdvertisements.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(getFavoriteAdvertisements.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload.flat();
//       })
//       .addCase(getFavoriteAdvertisements.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export default favoriteAdvertisementsSlice.reducer; 