import { createSlice } from '@reduxjs/toolkit';
import { getCategories, getCategoryByName } from '../thunks/categories';
import { z } from 'zod';

const CategorySchema = z.object({
  categoryId: z.number(),
  categorySeq: z.number(),
  categoryName: z.string(),
  imageLink: z.string(),
  categoryNameNoDiacritics: z.string(),
  createdDate: z.string(),
  updatedDate: z.string(),
  advertisementServices: z.string().nullable(),
  isActive: z.boolean(),
});

type Category = z.infer<typeof CategorySchema>;

interface CategoryState {
  items: Category[];
  selected: Category | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tất cả categories
      .addCase(getCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.status = 'success';
        const result = z.array(CategorySchema).safeParse(action.payload);
        if (result.success) {
          state.items = result.data;
        } else {
          state.error = 'Invalid data format';
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? null;
      })
      // Fetch category theo tên
      .addCase(getCategoryByName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategoryByName.fulfilled, (state, action) => {
        state.status = 'success';
        const result = CategorySchema.safeParse(action.payload);
        if (result.success) {
          state.selected = result.data;
        } else {
          state.error = 'Invalid data format';
        }
      })
      .addCase(getCategoryByName.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? null;
      });
  },
});

export default categorySlice.reducer;
