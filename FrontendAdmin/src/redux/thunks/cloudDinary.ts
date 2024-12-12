import { post } from './../../services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';
import { handleAuthError } from '../../utils/auth';

const apiUrl = import.meta.env.VITE_API_URL;

export const uploadImage = createAsyncThunk(
    'upload/uploadImage',
    async (formData: FormData, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;
  
        const response = await fetch(`${apiUrl}/api/v1/upload/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => {
            return { message: response.statusText || 'Upload failed' };
          });
          return rejectWithValue(errorData.message || 'Upload failed');
        }
  
        const data = await response.text();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );

  export const uploadOneImage = createAsyncThunk(
    'upload/uploadOneImage',
    async (
      { formData, onProgress }: { formData: FormData; onProgress?: (progress: number) => void },
      { rejectWithValue, getState }
    ) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;

        const response = await axios.post(`${apiUrl}/api/v1/upload/image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            onProgress?.(percentCompleted);
          },
        });

        return response.data;
      } catch (error: any) {
        if (handleAuthError(error)) {
          return rejectWithValue('AUTH_ERROR');
        }
        return rejectWithValue(error.message || 'An unknown error occurred');
      }
    }
  )
