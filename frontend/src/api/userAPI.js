import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

export const userAPI = {
  updateUserToPaid: async (userId) => {
    return axiosInstance.patch(`users/${userId}?type=paid`);
  },
  deleteResume: async (resumeId) => {
    return axiosInstance.delete(`resumes/${resumeId}`);
  },
};
