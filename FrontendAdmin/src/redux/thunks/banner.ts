import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
const apiUrl = (import.meta as any).env.VITE_API_URL;
import axios from 'axios';

// Định nghĩa interface cho request
interface BannerCreationRequest {
  imageUrl: string | null;
  linkUrl: string | null;
  title: string | null;
  description: string | null;
  type: 'TOP' | 'RIGHT' | 'LEFT' | 'BOTTOM';
  seq: number | null;
}

export const postBanner = createAsyncThunk(
  'banner/postBanner',
  async (payload: BannerCreationRequest, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch(`${apiUrl}/api/v1/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create banner');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create banner');
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banner/updateBanner',
  async (payload: {bannerId: number}, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch(`${apiUrl}/api/v1/banners/${payload.bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update banner');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
)

// Add new thunk for updating multiple banners
export const updateBanners = createAsyncThunk(
  'banner/updateBanners',
  async (banners: Banner[], { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch(`${apiUrl}/api/v1/banners/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(banners),
      });

      if (!response.ok) {
        throw new Error('Failed to update banners');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Add a new thunk to fetch banners by type
export const getBannersByType = createAsyncThunk(
  'banner/getBannersByType',
  async (type: string, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      let endpoint;
      switch (type) {
        case 'RIGHT':
          endpoint = '/api/v1/banners/all-right-banners';
          break;
        case 'TOP':
          endpoint = '/api/v1/banners/type/TOP/seq/1';
          break;
        default:
          endpoint = `/api/v1/banners/type/${type}`;
      }

      const response = await fetch(
        `${apiUrl}${endpoint}`,
        {
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Thêm action deleteBanner
export const deleteBanner = createAsyncThunk(
  'banner/deleteBanner',
  async (bannerId: number, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch(`${apiUrl}/api/v1/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);
