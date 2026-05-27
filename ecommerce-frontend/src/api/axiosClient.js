import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = (token) => {
    pendingRequests.forEach(({ resolve }) => resolve(token));
    pendingRequests = [];
};

const rejectPendingRequests = (error) => {
    pendingRequests.forEach(({ reject }) => reject(error));
    pendingRequests = [];
};

const clearAuthSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.token = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (!originalRequest || originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({
                        resolve: (token) => {
                            originalRequest.headers.token = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const response = await axiosClient.post('/auth/refresh');
                const newAccessToken = response.data.accessToken;

                localStorage.setItem('accessToken', newAccessToken);
                axiosClient.defaults.headers.common.token = `Bearer ${newAccessToken}`;
                resolvePendingRequests(newAccessToken);

                originalRequest.headers.token = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                clearAuthSession();
                rejectPendingRequests(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (status === 401) {
            clearAuthSession();
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
