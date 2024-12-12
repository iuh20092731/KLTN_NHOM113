import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store"; // Thêm import này

interface VisitStats {
  totalVisits: number;
  visitRateComparedToPreviousMonth: number;
}

// Thêm interface mới cho thống kê quảng cáo
interface AdvertisementStats {
  totalActiveAdvertisements: number;
  percentageChangeComparedToPreviousMonth: number;
}

interface UserStats {
  totalActiveUsers: number;
  percentageChange: number;
}

interface CategoryStats {
  categoryName: string;
  totalViews: number;
  lastAccess: string;
}

interface ServiceStats {
  serviceName: string;
  totalViews: number;
  lastAccess: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchVisitStats = createAsyncThunk<VisitStats, void>(
  "thongKe/fetchVisitStats",
  async (_, { rejectWithValue }) => {
    try {
      // Get current year and month
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

      const response = await axios.get<VisitStats>(
        `${apiUrl}/api/v1/web-visits/monthly-stats`,
        {
          params: {
            year,
            month,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Thêm thunk mới cho quảng cáo
export const fetchAdvertisementStats = createAsyncThunk<AdvertisementStats, void>(
  "thongKe/fetchAdvertisementStats",
  async (_, { rejectWithValue }) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await axios.get<AdvertisementStats>(
        `${apiUrl}/api/v1/main-advertisements/monthly-stats`,
        {
          params: {
            year,
            month,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchUserStats = createAsyncThunk<UserStats, void>(
  "thongKe/fetchUserStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const state = getState() as RootState;
      let token = state.user.token;
      
      // Thêm kiểm tra token trong sessionStorage
      if (!token) {
        token = sessionStorage.getItem('token');
        if (!token) {
          return rejectWithValue("No authentication token found in Redux or SessionStorage");
        }
      }

      const response = await axios.get<UserStats>(
        `${apiUrl}/api/v1/users/monthly-stats`,
        {
          params: {
            year,
            month,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchCategoryStats = createAsyncThunk<CategoryStats[], void>(
  "thongKe/fetchCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await axios.get<{ result: CategoryStats[] }>(
        `${apiUrl}/api/v1/categories/stats`,
        {
          params: {
            year,
            month,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchServiceStats = createAsyncThunk<ServiceStats[], void>(
  "thongKe/fetchServiceStats",
  async (_, { rejectWithValue }) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await axios.get<{ result: ServiceStats[] }>(
        `${apiUrl}/api/v1/advertisement-services/stats`,
        {
          params: {
            year,
            month,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
