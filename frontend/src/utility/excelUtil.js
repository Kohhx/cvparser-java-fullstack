import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

const convertToJsonList = (resumes) => {
  const resumeDatas = resumes.map((resume) => {
    return {
      email: resume.user.email,
      firstname: resume.user.firstName,
      lastname: resume.user.lastName,
      resume_file_name: resume.filename,
      resume_name: resume.name,
      resume_first_name: resume.firstName,
      resume_last_name: resume.lastName,
      resume_gender: resume.gender,
      resume_nationality: resume.nationality,
      resume_current_location: resume.currentLocation,
      resume_highest_qualification: resume.education,
      resume_last_job_title: resume.jobTitle,
      resume_profile: resume.profile,
      resume_email: resume.email,
      resume_mobile: resume.mobile,
      resume_employment_experiences: resume.yearsOfExperience,
      resume_skills: resume.skills.join(", "),
      resume_primary_skills: resume.primarySkills.join(", "),
      resume_secondary_skills: resume.secondarySkills.join(", "),
      resume_companies: resume.companies.join(", "),
      resume_createdAt: resume.createdAt,
      resume_updatedAt: resume.UpdatedAt,
    };
  });
  return resumeDatas;
};

const convertToJson = (resume) => {
  return [
    {
      email: resume.user.email,
      firstname: resume.user.firstName,
      lastname: resume.user.lastName,
      resume_file_name: resume.filename,
      resume_name: resume.name,
      resume_first_name: resume.firstName,
      resume_last_name: resume.lastName,
      resume_gender: resume.gender,
      resume_nationality: resume.nationality,
      resume_current_location: resume.currentLocation,
      resume_highest_qualification: resume.education,
      resume_last_job_title: resume.jobTitle,
      resume_profile: resume.profile,
      resume_email: resume.email,
      resume_mobile: resume.mobile,
      resume_employment_experiences: resume.yearsOfExperience,
      resume_skills: resume.skills.join(", "),
      resume_primary_skills: resume.primarySkills.join(", "),
      resume_secondary_skills: resume.secondarySkills.join(", "),
      resume_companies: resume.companies.join(", "),
      resume_createdAt: resume.createdAt,
      resume_updatedAt: resume.UpdatedAt,
    },
  ];
};

export const excelUtil = {
  exportToExcelCustom: (resume) => {
    const worksheet = utils.json_to_sheet(convertToJson(resume));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelData = write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelData], { type: "application/octet-stream" });
    saveAs(data, `${resume.filename}.xlsx`);
  },
  exportToExcel: (resumes) => {
    const worksheet = utils.json_to_sheet(convertToJsonList(resumes));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelData = write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelData], { type: "application/octet-stream" });
    saveAs(data, "Resume_data.xlsx");
  }
}
