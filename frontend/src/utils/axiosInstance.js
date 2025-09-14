import axios from 'axios';
import { API_BASE_URL } from './apiPath';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Axios Request Interceptor: Token attached ->", token); // ✅ DEBUG
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log("Axios Response:", response.status, response.data); // ✅ DEBUG
        return response;
    },
    (error) => {
        console.error("Axios Error:", error.response?.status, error.response?.data); // ✅ DEBUG
        return Promise.reject(error);
    }
);

export default axiosInstance;
