import axios from 'axios';
import { Platform } from "react-native";
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

function getBaseURL() {
    if (Platform.OS === 'web') {
        return 'http://localhost:9999/api';
    } else {
        return 'http://192.168.0.108:9999/api'
    }

}

export const api = axios.create({
    baseURL: getBaseURL(),
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