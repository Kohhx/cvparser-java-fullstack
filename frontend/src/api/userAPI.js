import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

export const userAPI = {
  updateUserToPaid: async (userId) => {
    return axiosInstance.patch(`users/${userId}?type=paid`);
  },
  updateUserToFree: async (userId) => {
    return axiosInstance.patch(`users/${userId}?type=free`);
  },
};
