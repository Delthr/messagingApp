import axios from 'axios';
import { getToken } from '../utils/storage';

// const API_URL = 'http://localhost:9999/api';

// const api = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     timeout: 10000,
// });

// export default api;

export const api = axios.create({
    baseURL: 'http://localhost:9999/api',
});


api.interceptors.request.use(
    async (config) => {
        const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/register');
        if (!isAuthRequest) {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;