import axios from "axios";
import Cookies from "js-cookie";


const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
        "domain": "digiform-api.adraproductstudio.com"
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
}, (error) => Promise.reject(error));


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get("refreshToken");
            if (!refreshToken) {
                Cookies.remove("accessToken");
                return Promise.reject(error);
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/refresh`, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    },
                });

                if (response.data && response.data.data.access_token) {
                    const newAccessToken = response.data.data.access_token;
                    Cookies.set("accessToken", newAccessToken)
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    console.error("Failed to refresh token. Logging out...");
                    Cookies.remove("accessToken");
                    Cookies.remove("refreshToken");
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
