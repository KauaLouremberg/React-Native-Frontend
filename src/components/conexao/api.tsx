import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastNotify } from '../ElementosForm/Toast';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) {
        ToastNotify({
          type: "error",
          title: "Erro",
          message: "Sessão expirada. Faça login novamente.",
        });

        throw new Error('Refresh token ausente');

      }

      const refreshResponse = await axios.post(`${API_URL}/refresh/`, {
        refresh: refreshToken,
      });

      const newAccess = refreshResponse.data.access;

      await AsyncStorage.setItem('accessToken', newAccess);

      processQueue(null, newAccess);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
