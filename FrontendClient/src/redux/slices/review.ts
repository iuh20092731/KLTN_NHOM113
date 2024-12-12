import { getReviewsByAdvertimentId } from '@/redux/thunks/review';
import { createSlice } from "@reduxjs/toolkit";
import type { ReviewSummary } from "../../types/Review";

interface ReviewsState {
  reviews: ReviewSummary;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: {
    averageRating: 0,
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,
    fourStarCount: 0,
    fiveStarCount: 0,
    reviews: [],
  },
  status: "idle",
  error: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Khi gửi request để lấy đánh giá
      .addCase(getReviewsByAdvertimentId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Khi request thành công
      .addCase(getReviewsByAdvertimentId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload as unknown as ReviewSummary;
      })
      // Khi request thất bại
      .addCase(getReviewsByAdvertimentId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.reviews = initialState.reviews;
      });
  },
});

export default reviewsSlice.reducer;
