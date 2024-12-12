import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api.service';
import { ClickTrackingReport, ClickTrackingReportV2 } from '../../interfaces/ClickTracking';

export const fetchCategoryReports = createAsyncThunk(
  'clickTracking/fetchCategoryReports',
  async (params: { year: number; month: number }) => {
    const response = await get<ClickTrackingReport[]>('/api/v1/click-tracking/reports/category', params);
    return response.data;
  }
);

export const fetchServiceReports = createAsyncThunk(
  'clickTracking/fetchServiceReports',
  async (params: { year: number; month: number }) => {
    const response = await get<ClickTrackingReport[]>('/api/v1/click-tracking/reports/service', params);
    return response.data;
  }
);

export const fetchCategoryReportsV2 = createAsyncThunk(
  'clickTracking/fetchCategoryReportsV2',
  async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const response = await get<ClickTrackingReportV2[]>(
      `/api/v2/click-tracking/reports/category`,
      { year, month }
    );
    return response.data;
  }
); 