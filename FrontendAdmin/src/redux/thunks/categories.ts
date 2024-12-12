import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import instance from '../../config/axios.config';
import { Category } from '../../interfaces/Category';
import axios from 'axios';

// Fetch tất cả categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get<{ result: Category[] }>(
        '/api/v1/categories',
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch category theo tên
export const getCategoryByName = createAsyncThunk(
  'category/getByName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await instance.get<{ result: Category }>(
        `/api/v1/categories/${name}`,
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      let token = state.user.token;

      if (!token) {
        token = sessionStorage.getItem('token');
        if (!token) {
          return rejectWithValue('No authentication token found');
        }
      }

      const response = await instance.delete(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (
    category: {
      categorySeq: number;
      categoryName: string;
      categoryNameNoDiacritics: string;
      imageLink: string;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      let token = state.user.token;

      if (!token) {
        token = sessionStorage.getItem('token');
        if (!token) {
          return rejectWithValue('No authentication token found');
        }
      }

      const response = await instance.post('/api/v1/categories', {
        categorySeq: category.categorySeq,
        categoryName: category.categoryName,
        categoryNameNoDiacritics: category.categoryNameNoDiacritics,
        imageLink: category.imageLink,
      });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCategoryStatus = createAsyncThunk(
  'categories/updateStatus',
  async (
    { categoryId, status }: { categoryId: number; status: boolean },
    { rejectWithValue },
  ) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await instance.put(
        `/api/v1/categories/${categoryId}/status`,
        JSON.stringify(status),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  },
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async (
    { categoryId, data }: { categoryId: number; data: any },
    { rejectWithValue },
  ) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await instance.put(
        `/api/v1/categories/${categoryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
