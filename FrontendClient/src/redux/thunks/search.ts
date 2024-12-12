import { ENDPOINTS } from '@/constants/endpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Tạo thunk để gọi API
export const fetchSearch = createAsyncThunk(
  'data/fetchSearch',
  async (keyword: string, { rejectWithValue }) => {
    try {
      const requestData = { keyword };  // Đặt keyword vào request body

      const response = await axios.post(`${ENDPOINTS.SEARCH}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Kiểm tra nếu API trả về code không phải 1000 thì sẽ coi là lỗi
      if (response.data.code !== 1000) {
        return rejectWithValue('API returned an error');
      }

      // Trả về dữ liệu từ result
      return response.data.result;
    } catch (error) {
      const typedError = error as any;
      return rejectWithValue(typedError.response?.data?.message || 'Error fetching data');
    }
  }
);

