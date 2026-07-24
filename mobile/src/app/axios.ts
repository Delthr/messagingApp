import axios from 'axios';

const API_URL = 'http://loaclhost:9999';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
export default api;