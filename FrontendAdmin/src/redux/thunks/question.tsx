import { createAsyncThunk } from "@reduxjs/toolkit";
import { del, get } from "../../services/api.service";
import { ApiQuestionResponse } from "../../types/question";


const apiUrl = (import.meta as any).env.VITE_API_URL;

export interface PaginationParams {
    page?: number;
    size?: number;
}

export const getQuestions = createAsyncThunk(
    "question/getQuestions",
    async (paginationParams: PaginationParams = {page:0, size:2}, { rejectWithValue }) => {
        try {
            const response = await get<ApiQuestionResponse>(`${apiUrl}/api/v1/questions?page=${paginationParams.page}&size=${paginationParams.size}`);
            return response.data.result
        } catch (error) {
            return rejectWithValue(error)
        }
    }
) 

export const deleteQuestions = createAsyncThunk(
    "question/deleteQuestion",
    async(questionId: number, {rejectWithValue}) => {
        try {
            const response = await del(`${apiUrl}/api/v1/questions/${questionId}`)
            return response.data
        } catch(error) {
            rejectWithValue(error)
        }
    }
)


export const deleteComment = createAsyncThunk(
    "comment/deleteComment",
    async(commentId: number, {rejectWithValue}) => {
        try{
            const response = await del(`${apiUrl}/api/v1/comments/${commentId}`)
            return response.data
        } catch(error) {
            rejectWithValue(error)
        }
    }
)



