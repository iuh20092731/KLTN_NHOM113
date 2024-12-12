import { createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../../services/api.service";
import { ENDPOINTS } from "../../constants/endpoints";
import type { Review } from "../../types/Review";

export const getReviewsByAdvertimentId = createAsyncThunk(
  "reviews/getReviewsByAdvertimentId",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await get<Review[]>(ENDPOINTS.REVIEWS + `/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const postReview = createAsyncThunk(
  "reviews/postReview",
  async (reviewData: {
    advertisementId: number,
    userId: string,
    rating: number,
    reviewContent: string
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await post<Review>(ENDPOINTS.POST_REVIEW, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);