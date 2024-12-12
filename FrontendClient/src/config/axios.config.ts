import axios from 'axios';
import { isTokenValid } from '../utils/token';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token && isTokenValid(token)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
