import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCategoryStats, 
  fetchServiceStats, 
  fetchAdvertisementStats 
} from '../thunks/thongKe';

interface StatisticsState {
  categoryStats: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
  serviceStats: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
  advertisementStats: {
    data: any;
    loading: boolean;
    error: string | null;
  };
}

const initialState: StatisticsState = {
  categoryStats: {
    data: [],
    loading: false,
    error: null
  },
  serviceStats: {
    data: [],
    loading: false,
    error: null
  },
  advertisementStats: {
    data: null,
    loading: false,
    error: null
  }
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Category Stats
    builder
      .addCase(fetchCategoryStats.pending, (state) => {
        state.categoryStats.loading = true;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.categoryStats.loading = false;
        state.categoryStats.data = action.payload;
        state.categoryStats.error = null;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.categoryStats.loading = false;
        state.categoryStats.error = action.error.message || 'Failed to fetch category stats';
      });

    // Service Stats  
    builder
      .addCase(fetchServiceStats.pending, (state) => {
        state.serviceStats.loading = true;
      })
      .addCase(fetchServiceStats.fulfilled, (state, action) => {
        state.serviceStats.loading = false;
        state.serviceStats.data = action.payload;
        state.serviceStats.error = null;
      })
      .addCase(fetchServiceStats.rejected, (state, action) => {
        state.serviceStats.loading = false;
        state.serviceStats.error = action.error.message || 'Failed to fetch service stats';
      });

    // Advertisement Stats
    builder
      .addCase(fetchAdvertisementStats.pending, (state) => {
        state.advertisementStats.loading = true;
      })
      .addCase(fetchAdvertisementStats.fulfilled, (state, action) => {
        state.advertisementStats.loading = false;
        state.advertisementStats.data = action.payload;
        state.advertisementStats.error = null;
      })
      .addCase(fetchAdvertisementStats.rejected, (state, action) => {
        state.advertisementStats.loading = false;
        state.advertisementStats.error = action.error.message || 'Failed to fetch advertisement stats';
      });
  }
});

export default statisticsSlice.reducer; 