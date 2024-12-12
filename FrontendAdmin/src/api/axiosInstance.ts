import axios from 'axios';
import { isTokenValid } from '../utils/token';
import store from '../redux/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // First try to get token from Redux state
    let token = store.getState().user.token;
    
    // If not in Redux, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem('token');
    }

    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      sessionStorage.removeItem('token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 