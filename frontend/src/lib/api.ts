import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Ensure cookies (credentials) are sent so auth flows and CORS preflight include credentials
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            Cookies.remove('user');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
