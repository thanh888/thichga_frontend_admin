import axios from 'axios';

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const instance = axios.create({
  baseURL: `${BASE_API_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('account');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshTokenInProgress = false;
let refreshTokenPromise: Promise<any> | null = null;

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/sign-in') {
      originalRequest._retry = true;

      if (refreshTokenInProgress) {
        // Chờ refresh token hoàn tất nếu đang xử lý
        if (refreshTokenPromise) {
          return refreshTokenPromise.then(() => instance(originalRequest));
        }
      }
      refreshTokenInProgress = true;
      refreshTokenPromise = instance.post('/auth/refresh-token');
      try {
        const { data } = await refreshTokenPromise;
        instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        refreshTokenInProgress = false;

        return instance(originalRequest);
      } catch (refreshError) {
        refreshTokenInProgress = false;
        localStorage.removeItem('token'); // Xóa token nếu refresh thất bại
        // window.location.href = '/auth/sign-in';
        return Promise.reject(refreshError);
      } finally {
        // window.location.href = '/auth/sign-in';
        refreshTokenPromise = null;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
