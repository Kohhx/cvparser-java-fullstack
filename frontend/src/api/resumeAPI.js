import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

export const resumeAPI = {
  uploadResume: async (resumeDetails) => {
    return axiosInstance
      .post("resumes", resumeDetails)
  },
  uploadResume2: async (resumeDetails) => {
    return axiosInstance
      .post("resumes/test", resumeDetails)
  },
  getUserResumes: async (userId) => {
    return axiosInstance.get(`users/${userId}/resumes`);
  },
  getResume: async (userId, resume) => {
    return axiosInstance.get(`users/${userId}/resumes/${resume}`);
  },
  updateResume: async (resumeDetails) => {
    return axiosInstance.patch(`resumes/${resumeDetails.id}`, resumeDetails);
  },
  deleteResume: async (resumeId) => {
    return axiosInstance.delete(`resumes/${resumeId}`);
  }
};
