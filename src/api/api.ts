import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                isRefreshing = false;
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${BASE_URL}/v1/auth/refresh/`, {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;

                localStorage.setItem("token", access_token);
                if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken);
                }

                api.defaults.headers.common["Authorization"] = "Bearer " + access_token;
                originalRequest.headers["Authorization"] = "Bearer " + access_token;

                processQueue(null, access_token);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
