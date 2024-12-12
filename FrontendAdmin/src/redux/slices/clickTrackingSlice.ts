import { createSlice } from '@reduxjs/toolkit';
import { fetchCategoryReports, fetchServiceReports, fetchCategoryReportsV2 } from '../thunks/clickTracking';
import { ClickTrackingState, ClickTrackingReportV2 } from '../../interfaces/ClickTracking';

interface ExtendedState extends ClickTrackingState {
  categoryReports: ClickTrackingReportV2[];
}

const initialState: ExtendedState = {
  reports: [],
  categoryReports: [],
  loading: false,
  error: null
};

const clickTrackingSlice = createSlice({
  name: 'clickTracking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Category Reports
    builder
      .addCase(fetchCategoryReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category reports';
      })
    // Service Reports  
    builder
      .addCase(fetchServiceReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service reports';
      })
    // Category Reports V2
    builder
      .addCase(fetchCategoryReportsV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryReportsV2.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryReports = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryReportsV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category reports';
      });
  }
});

export default clickTrackingSlice.reducer; 