import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

export const resumeAPI = {
  uploadResume: async (resumeDetails) => {
    axiosInstance
      .post("resumes", resumeDetails)
      .then((res) => {
        toast.success("Resume uploaded successfully.");
        return res;
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in uploading resume. Please try again.")
      });
  },
  getUserResumes: async (userId) => {
      return axiosInstance.get(`users/${userId}/resumes`);
  }
};
