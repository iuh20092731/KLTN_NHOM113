import { ENDPOINTS } from "@/constants/endpoints"; 
import { createAsyncThunk } from "@reduxjs/toolkit";

export const uploadImage = createAsyncThunk(
    'upload/uploadImage',
    async (formData: FormData, { rejectWithValue }) => {
      const token = localStorage.getItem('token');
      try {
        // const state = getState() as RootState;
        // const token = state.auth.token;
        // console.log("token", token);
        
        const response = await fetch(`${ENDPOINTS.UPLOAD_IMAGE}`, {
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


