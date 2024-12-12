import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import instance from '../../config/axios.config';

interface SocialGroupLinkResponse {
  id: number;
  serial: number;
  platform: string;
  groupName: string;
  groupLink: string;
  description: string;
  remark: string;
  isActive: boolean;
  imageUrl: string;
}

interface ApiResponse<T> {
  result: T;
}

export const getSocialGroupLinks = createAsyncThunk(
  'socialGroupLinks/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get<ApiResponse<SocialGroupLinkResponse[]>>(
        '/api/v1/social-group-links'
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSocialGroupLinkStatus = createAsyncThunk(
  'socialGroupLinks/updateStatus',
  async ({ id, status }: { id: number; status: boolean }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/api/v1/social-group-links/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSocialGroupLink = createAsyncThunk(
  'socialGroupLinks/create',
  async (request: SocialGroupLinkCreationRequest, { rejectWithValue }) => {
    try {
      const response = await instance.post<ApiResponse<SocialGroupLinkResponse>>(
        '/api/v1/social-group-links',
        request
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSocialGroupLink = createAsyncThunk(
  'socialGroupLinks/delete',
  async (linkId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      let token = state.user.token;

      if (!token) {
        token = sessionStorage.getItem('token');
        if (!token) {
          return rejectWithValue('No authentication token found');
        }
      }

      const response = await instance.delete(`/api/v1/social-group-links/${linkId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 