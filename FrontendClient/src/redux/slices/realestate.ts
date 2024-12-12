import { RealEstateListing } from './../../types/RealEstateListing';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postRealEstate, getRealEstateListPaginated, RealEstatePost as ThunkRealEstatePost, getRealEstateMediaById, getRealEstateListings } from '../thunks/realestate';
import { RealEstatePost as TypeRealEstatePost } from '../../types/realEstate';
import { RealEstateMedia } from '@/types/RealEstateListing';

interface RealEstateState {
  items: TypeRealEstatePost[];
  realEstateMedia: RealEstateMedia[];
  RealEstateListing: RealEstateListing[],
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  paginatedList: {
    data: ThunkRealEstatePost[];
    total: number;
    page: number;
    size: number;
  };
}

const initialState: RealEstateState = {
  items: [],
  realEstateMedia: [],
  RealEstateListing: [],
  status: 'idle',
  error: null,
  paginatedList: {
    data: [],
    total: 0,
    page: 0,
    size: 5,
  },
};

const realEstateSlice = createSlice({
  name: 'realEstate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postRealEstate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postRealEstate.fulfilled, (state, action) => {
        state.status = 'success';
        state.items.push(action.payload as TypeRealEstatePost);
      })
      .addCase(postRealEstate.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || null;
      })
      .addCase(getRealEstateListPaginated.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRealEstateListPaginated.fulfilled, (state, action: PayloadAction<{ data: ThunkRealEstatePost[]; total: number; page: number; size: number }>) => {
        state.status = 'success';
        state.paginatedList = action.payload;
      })

      .addCase(getRealEstateListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRealEstateListings.fulfilled, (state, action) => {
        state.status = 'success';
        state.RealEstateListing = action.payload;
      })
      .addCase(getRealEstateListings.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string || 'An error occurred';
      })
      .addCase(getRealEstateListPaginated.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string || 'An error occurred';
      })
      .addCase(getRealEstateMediaById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRealEstateMediaById.fulfilled, (state, action) => {
        state.status = 'success';
        state.realEstateMedia = action.payload;
      })
      .addCase(getRealEstateMediaById.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string || 'An error occurred';
      });

  },
});

export default realEstateSlice.reducer;
