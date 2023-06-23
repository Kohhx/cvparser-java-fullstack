import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

export const resumeAPI = {
  uploadResume: async (resumeDetails) => {
    return axiosInstance
      .post("resumes", resumeDetails)
      // .then((res) => {
      //   toast.success("Resume uploaded successfully.");
      // })
      // .catch((err) => {
      //   console.log(err);
      //   toast.error("Error in uploading resume. Please try again.");
      // });
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
