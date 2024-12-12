import { isTokenValid } from './../utils/token';
import axios from 'axios';
import store from '../redux/store';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false
});

instance.interceptors.request.use(
    config => {
        // First try to get token from Redux state
        let token = store.getState().user.token;
        
        // If not in Redux, try sessionStorage
        if (!token) {
            token = sessionStorage.getItem('token');
        }

        if (token && isTokenValid(token)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            sessionStorage.removeItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
