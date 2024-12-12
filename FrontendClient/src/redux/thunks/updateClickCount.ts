import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "@/constants/endpoints";


export const updateClickCount = createAsyncThunk<number, number,{ rejectValue: string }>(
  'advertisements/updateClickCount',
  async (advertisementId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINTS.UPDATE_CLICK_ADVER}/${advertisementId}/click`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update click count');
      }

      const data: number = await response.json();
      return data;
    } catch (error) {
      console.error('Error in updateClickCount:', error);
      return rejectWithValue('Error updating click count');
    }
  }
);
