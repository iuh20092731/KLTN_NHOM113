import { uploadImage } from './../thunks/uploadImage';
import { createSlice } from '@reduxjs/toolkit';

interface UploadState {
  imageUrl: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UploadState = {
  imageUrl: null,
  status: 'idle',
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.imageUrl = action.payload;
      })
      // .addCase(uploadImage.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.payload || 'Upload failed';
      // });
  },
});

export default uploadSlice.reducer;
