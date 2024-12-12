// import { createSlice } from '@reduxjs/toolkit';
// import { getFavoriteAdvertisements } from '../thunks/favoriteAdvertisements';

// type MainAdvertisement = object;

// interface FavoriteAdvertisementsState {
//   items: MainAdvertisement[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const favoriteAdvertisementsSlice = createSlice({
//   name: 'favoriteAdvertisements',
//   initialState: {
//     items: [] as MainAdvertisement[],
//     status: 'idle',
//     error: null
//   } as FavoriteAdvertisementsState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getFavoriteAdvertisements.pending, (state) => {
//         state.status = 'loading'
//       })
//       .addCase(getFavoriteAdvertisements.fulfilled, (state, action) => {
//         state.status = 'succeeded'
//         state.items = action.payload.flat()
//       })
//       .addCase(getFavoriteAdvertisements.rejected, (state, action) => {
//         state.status = 'failed'
//         state.error = action.error.message || null
//       })
//   },
// });

// export default favoriteAdvertisementsSlice.reducer; 