import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api"
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Handle request config
    const token = sessionStorage.getItem("token");
    const authLogin = sessionStorage.getItem("authenticatedUser");
    if (token && authLogin) {
      config.headers.Authorization = token;
      return config;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
