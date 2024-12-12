import { ENDPOINTS } from "@/constants/endpoints";
import { get, post, put } from "@/services/api.service";
import { ApiQuestionResponse } from "@/types/Question";
import { createAsyncThunk } from "@reduxjs/toolkit";


export interface PaginationParams {
    page?: number;
    size?: number;
}

export const getQuestions = createAsyncThunk(
    "question/getQuestions",
    async (paginationParams: PaginationParams = {page:0, size:2}, { rejectWithValue }) => {
        try {
            const response = await get<ApiQuestionResponse>(`${ENDPOINTS.QUESTIONS}?page=${paginationParams.page}&size=${paginationParams.size}`);
            return response.data.result
        } catch (error) {
            return rejectWithValue(error)
        }
    }
) 


interface QuestionRequest {
    content: string;
    createdByUserId: string | null;
    createDate: string;
}

export const postQuestion = createAsyncThunk(
    "question/postQuestion",
    async(question: QuestionRequest, {rejectWithValue}) => {
        try {
            const response = await post(ENDPOINTS.QUESTIONS, question);
            return response.data
        } catch(error) {
            rejectWithValue(error);
        }
    }
)

interface CommentPayload {
    commentText: string,
    questionId: number,
    createDate: string
}

export const postComment = createAsyncThunk(
    "comment/postComment",
    async(comment: CommentPayload, {rejectWithValue}) => {
        try {
            const response = await post(ENDPOINTS.COMMENT, comment);
            return response.data;
        } catch (error) {
            rejectWithValue(error);
        }
    }
)

interface ReplyPayload {
    commentText: string,
    questionId: number,
    createdByUserId: string | null,
    id: number;
    createDate: string;
}

export const postReply = createAsyncThunk(
    "reply/postReply",
    async(reply: ReplyPayload, {rejectWithValue}) => {
        try {
            const response = await post(`${ENDPOINTS.COMMENT}/${reply.id}/replies`, reply);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const likeQuestion = createAsyncThunk(
    "like/putLike",
    async(questionId: number, {rejectWithValue}) => {
        try {
            const response = await put(`${ENDPOINTS.QUESTIONS}/${questionId}/likes`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)