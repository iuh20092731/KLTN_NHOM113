import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../services/api.service";
import { UserResponse } from "../../interfaces/UserResponse";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import axios from "axios";


interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zalo: string;
    facebook: string;
    avatar: string;
    userType: "USER";
}
const apiUrl = import.meta.env.VITE_API_URL;
export const createAccount = createAsyncThunk<UserResponse, { userData: User, token: string }, { state: RootState }>(
  'account/create',
  async ({ userData, token }, { rejectWithValue }) => {
    console.log("token thunks:", token);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log("Headers:", headers); // Log the headers object
      const response = await axios.post<UserResponse>(`${apiUrl}/api/v1/users/create/admin`, userData, { headers });
      return response.data;
    } catch (error: any) {
      console.error("Error in createAccount:", error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

