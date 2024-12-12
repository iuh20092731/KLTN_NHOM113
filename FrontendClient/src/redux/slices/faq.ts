import { createSlice } from '@reduxjs/toolkit';
import { getFaqsByAdvertimentId } from '../thunks/faq';
import type { Faq } from '../../types/Faq';

interface FAQState {
  faqs: Faq[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FAQState = {
  faqs: [],
  status: "idle",
  error: null,
};

const faqSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Khi bắt đầu gửi request
      .addCase(getFaqsByAdvertimentId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Khi request thành công
      .addCase(getFaqsByAdvertimentId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.faqs = action.payload.result;
      })
      // Khi request thất bại
      .addCase(getFaqsByAdvertimentId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default faqSlice.reducer;