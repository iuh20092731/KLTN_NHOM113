import { createSlice } from '@reduxjs/toolkit';
import { ApiQuestionResponse } from '../../types/question'; 
import { getQuestions } from '../thunks/question';
interface CommentsState {
  data: ApiQuestionResponse['result'] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  data: null,
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })

    //   .addCase(likeQuestion.fulfilled, (state, action) => {
    //     const questionId = action.meta.arg;
    //     const question = state.data?.content.find((q) => q.id === questionId);
    //     if (question) {
    //       question.likeCount += 1;
    //     }
    //   })
    //   .addCase(likeQuestion.rejected, (state, action) => {
    //     state.error = action.payload as string;
    //   });
  },
});

export default questionsSlice.reducer;
