import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.service";
import { Service, ServiceSchema } from "../../interfaces/Service";
import axios from "axios";
import { RootState } from '../store';

interface ApiResponse<T> {
  code: number;
  result: T[];
}
const apiUrl = (import.meta as any).env.VITE_API_URL;
export const getServiceByName = createAsyncThunk(
  "service/getByName",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service[]>>(`${apiUrl}/api/v1/advertisement-services/category?categoryName=${categoryName}`);
      const validatedResponse = ServiceSchema.array().parse(response.data.result);
      return validatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getServiceByCategoryId = createAsyncThunk(
  'service/getByName',
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service[]>>(
        `${apiUrl}/api/v1/advertisement-services/category/${categoryName}`,
      );
      const validatedResponse = ServiceSchema.array().parse(
        response.data.result,
      );
      return validatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getServiceById = createAsyncThunk(
  "service/getById",
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service>>(`${apiUrl}/api/v1/advertisement-services/${serviceId}`);
      const validatedResponse = ServiceSchema.parse(response.data.result);
      return validatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getServices = createAsyncThunk(
  "service/getServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<ApiResponse<Service[]>>(`${apiUrl}/api/v1/advertisement-services`);
      const validatedResponse = ServiceSchema.array().parse(response.data.result);
      return validatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createService = createAsyncThunk(
  "service/createService",
  async (service: Service, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post<ApiResponse<Service>>(
        `${apiUrl}/api/v1/advertisement-services`, 
        service,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ serviceId, data }: { serviceId: number; data: Partial<Service> }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.patch<ApiResponse<Service>>(
        `${apiUrl}/api/v1/advertisement-services/${serviceId}/status`,
        data.isActive !== undefined ? data.isActive : data.deliveryAvailable,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        },
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete<ApiResponse<Service>>(
        `${apiUrl}/api/v1/advertisement-services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const updateAdvertisementService = createAsyncThunk(
  'service/updateAdvertisementService',
  async ({ serviceId, data }: { serviceId: number; data: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token || sessionStorage.getItem('token');

      const response = await axios.put(`${apiUrl}/api/v2/advertisement-services/${serviceId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAdvertisementService = createAsyncThunk(
  'service/deleteAdvertisementService',
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/api/v1/advertisement-services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// export const getServiceById = createAsyncThunk(
//   'service/getServiceById',
//   async (serviceId: number) => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/v1/advertisement-services/${serviceId}`);
//       return response.data.result;
//     } catch (error) {
//       throw error;
//     }
//   }
// );

