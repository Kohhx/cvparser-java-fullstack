import React, { useState, useEffect, useContext } from "react";
import "./css/Resume.css";
import { AiFillEdit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { RiAddCircleFill } from "react-icons/ri";
import { useParams, useNavigate } from "react-router-dom";
import { resumeAPI } from "../api/resumeAPI";
import { toast } from "react-toastify";
import { excelUtil } from "../utility/excelUtil";
import { UserContext } from "../context/userContext";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";
// import ReactPDF from '@react-pdf/renderer';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../utility/PDFDocument";
import ResumeFieldList from "../components/shared/ResumeFieldList";
import ResumeFieldInput from "../components/shared/ResumeFieldInput";
import { projectStorage } from "../firebase/config";
import { fileUtil } from "../utility/fileUtil";
import Modal from "../components/shared/Modal";
import { wordUtil } from "../utility/wordUtil";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import ResumeCompanyField from "../components/shared/ResumeCompanyField";
import ResumeEducationField from "../components/shared/ResumeEducationField";

const Resume = () => {
  const ctx = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);

  const [fileName, setFileName] = useState({
    value: "Koh He Xiang",
    isEditing: false,
    valid: true,
  });

  const [name, setName] = useState({
    value: "Koh He Xiang",
    isEditing: false,
  });

  const [email, setEmail] = useState({
    value: "k@gmail.com",
    isEditing: false,
  });

  const [mobile, setMobile] = useState({
    value: "+65 9999999",
    isEditing: false,
  });

  const [yearsOfExp, setYearsOfExp] = useState({
    value: 0,
    isEditing: false,
  });

  const [skill, setSkill] = useState({
    value: "",
    isEditing: false,
  });

  const [skills, setSkills] = useState([]);

  const [company1, setCompany1] = useState({
    value: "",
    isEditing: false,
  });
  const [company2, setCompany2] = useState({
    value: "",
    isEditing: false,
  });
  const [company3, setCompany3] = useState({
    value: "",
    isEditing: false,
  });
  const [qualification, setQualification] = useState({
    value: "",
    isEditing: false,
  });

  const [showCompaniesDetails, setShowCompaniesDetails] = useState(false);
  const [companiesDetails, setCompaniesDetails] = useState([]);

  // Updated fields 12072023
  const [firstName, setFirstName] = useState({
    value: "",
    isEditing: false,
  });
  const [lastName, setLastName] = useState({
    value: "",
    isEditing: false,
  });
  const [gender, setGender] = useState({
    value: "",
    isEditing: false,
  });
  const [nationality, setNationality] = useState({
    value: "",
    isEditing: false,
  });
  const [location, setLocation] = useState({
    value: "",
    isEditing: false,
  });
  const [profile, setProfile] = useState({
    value: "",
    isEditing: false,
  });
  const [jobTitle, setJobTitle] = useState({
    value: "",
    isEditing: false,
  });

  //Primary Skills
  const [primarySkill, setPrimarySkill] = useState({
    value: "",
    isEditing: false,
  });
  const [primarySkills, setPrimarySkills] = useState([]);

  //Secondary Skills
  const [secondarySkill, setSecondarySkill] = useState({
    value: "",
    isEditing: false,
  });
  const [secondarySkills, setSecondarySkills] = useState([]);

  // Spoken Languages
  const [spokenLanguage, setSpokenLanguage] = useState({
    value: "",
    isEditing: false,
  });
  const [spokenLanguages, setSpokenLanguages] = useState([]);

  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [educationDetails, setEducationDetails] = useState([]);

  const deleteSkill = (skillIndex) => {
    setSkills((prev) => prev.filter((skill, index) => index !== skillIndex));
  };

  const handleFileNameChange = (e) => {
    if (e.target.value === "") {
      setFileName((prev) => ({ ...prev, valid: false }));
    } else {
      setFileName((prev) => ({ ...prev, valid: true }));
    }
    setFileName((prev) => ({ ...prev, value: e.target.value }));
  };

  console.log(resume);

  const convertDateFormat = (date) => {
    const dateArray = date.split("/");
    const dateOut = dateArray[1] + "-" + dateArray[0];
    return dateOut;
  };

  // Convert date format from 2023`-11 to 11/2023
  const convertDateFormatForSave = (date) => {
    const dateArray2 = date.split("-");
    const dateOut2 = dateArray2[1] + "/" + dateArray2[0];
    return dateOut2;
  };

  const convertFieldsDateFormat = (fields) => {
    return fields.map((field) => {
      return {
        ...field,
        startDate: convertDateFormat(field.startDate),
        endDate: convertDateFormat(field.endDate),
      };
    });
  };

  const convertFieldsDateFormatSave = (fields) => {
    return fields.map((field) => {
      return {
        ...field,
        startDate: convertDateFormatForSave(field.startDate),
        endDate: convertDateFormatForSave(field.endDate),
      };
    });
  };

  const handleUpdateResume = () => {
    console.log(fileName.value);
    console.log(name.value);
    console.log(email.value);
    console.log(mobile.value);
    console.log(yearsOfExp.value);
    console.log(skills);
    console.log(company1.value);
    console.log(company2.value);
    console.log(company3.value);

    const resumeDetails = {
      id: params.resumeId,
      fileName: fileName.value,
      name: name.value,
      email: email.value,
      mobile: mobile.value,
      education: qualification.value,
      yearsOfExperience: +yearsOfExp.value,
      skills: skills,
      companies: [company1.value, company2.value, company3.value],
      companiesDetails: JSON.stringify(
        convertFieldsDateFormatSave(companiesDetails)
      ),
      educationDetails: JSON.stringify(
        convertFieldsDateFormatSave(educationDetails)
      ),
      // Updated fields 12072023
      firstName: firstName.value,
      lastName: lastName.value,
      gender: gender.value,
      nationality: nationality.value,
      location: location.value,
      profile: profile.value,
      jobTitle: jobTitle.value,
      primarySkills: JSON.stringify(primarySkills),
      secondarySkills: JSON.stringify(secondarySkills),
      spokenLanguages: JSON.stringify(spokenLanguages),
    };

    console.log(resumeDetails);

    resumeAPI.updateResume(resumeDetails).then((res) => {
      console.log(res.data);
      const resumeGet = { ...res.data };
      resumeGet.companiesDetails = convertFieldsDateFormat(
        JSON.parse(resumeGet.companiesDetails)
      );
      resumeGet.primarySkills = JSON.parse(resumeGet.primarySkills);
      resumeGet.secondarySkills = JSON.parse(resumeGet.secondarySkills);
      resumeGet.spokenLanguages = JSON.parse(resumeGet.spokenLanguages);
      // resumeGet.educationDetails = JSON.parse(resumeGet.educationDetails);
      resumeGet.educationDetails = convertFieldsDateFormat(
        JSON.parse(resumeGet.educationDetails)
      );
      setResume(resumeGet);
      setAllEditableToFalse();
      toast.success("Resume updated successfully.");
    });
  };

  const handleDeleteResume = () => {
    resumeAPI.deleteResume(params.resumeId).then((res) => {
      console.log(res);
      toast.success("Resume deleted successfully.");
      navigate(`/users/${params.userId}/resumes`);
    });
  };

  const setAllEditableToFalse = () => {
    setFileName((prev) => ({ ...prev, isEditing: false }));
    setName((prev) => ({ ...prev, isEditing: false }));
    setEmail((prev) => ({ ...prev, isEditing: false }));
    setMobile((prev) => ({ ...prev, isEditing: false }));
    setYearsOfExp((prev) => ({ ...prev, isEditing: false }));
    setSkill((prev) => ({ ...prev, isEditing: false }));
    setCompany1((prev) => ({ ...prev, isEditing: false }));
    setCompany2((prev) => ({ ...prev, isEditing: false }));
    setCompany3((prev) => ({ ...prev, isEditing: false }));
    setQualification((prev) => ({ ...prev, isEditing: false }));
    // Updated fields 12072023
    setFirstName((prev) => ({ ...prev, isEditing: false }));
    setLastName((prev) => ({ ...prev, isEditing: false }));
    setGender((prev) => ({ ...prev, isEditing: false }));
    setNationality((prev) => ({ ...prev, isEditing: false }));
    setLocation((prev) => ({ ...prev, isEditing: false }));
    setProfile((prev) => ({ ...prev, isEditing: false }));
    setJobTitle((prev) => ({ ...prev, isEditing: false }));
    setPrimarySkill((prev) => ({ ...prev, isEditing: false }));
    setSecondarySkill((prev) => ({ ...prev, isEditing: false }));
    setSpokenLanguage((prev) => ({ ...prev, isEditing: false }));
  };

  const setFields = (resume) => {
    setFileName((prev) => ({ ...prev, value: resume?.filename }));
    setName((prev) => ({ ...prev, value: resume?.name }));
    setEmail((prev) => ({ ...prev, value: resume?.email }));
    setMobile((prev) => ({ ...prev, value: resume?.mobile }));
    setYearsOfExp((prev) => ({
      ...prev,
      value: resume?.yearsOfExperience.toFixed(1),
    }));
    setSkills((prev) => [...prev, ...resume?.skills]);
    setCompany1((prev) => ({ ...prev, value: resume?.companies?.[0] }));
    setCompany2((prev) => ({ ...prev, value: resume?.companies?.[1] }));
    setCompany3((prev) => ({ ...prev, value: resume?.companies?.[2] }));
    setQualification((prev) => ({ ...prev, value: resume?.education }));
    setCompaniesDetails((prev) => [...prev, ...resume?.companiesDetails]);
    setEducationDetails((prev) => [...prev, ...resume?.educationDetails]);
    // Updated fields 12072023
    setFirstName((prev) => ({ ...prev, value: resume?.firstName }));
    setLastName((prev) => ({ ...prev, value: resume?.lastName }));
    setGender((prev) => ({ ...prev, value: resume?.gender }));
    setProfile((prev) => ({ ...prev, value: resume?.profile }));
    setLocation((prev) => ({ ...prev, value: resume?.currentLocation }));
    setNationality((prev) => ({ ...prev, value: resume?.nationality }));
    setJobTitle((prev) => ({ ...prev, value: resume?.jobTitle }));
    setSpokenLanguages((prev) => [...prev, ...resume?.spokenLanguages]);
    setPrimarySkills((prev) => [...prev, ...resume?.primarySkills]);
    setSecondarySkills((prev) => [...prev, ...resume?.secondarySkills]);
  };

  useEffect(() => {
    resumeAPI
      .getResume(params.userId, params.resumeId)
      .then((res) => {
        console.log(res.data);
        const resumeGet = { ...res.data };
        resumeGet.companiesDetails = convertFieldsDateFormat(
          JSON.parse(resumeGet.companiesDetails)
        );
        resumeGet.primarySkills = JSON.parse(resumeGet.primarySkills);
        resumeGet.secondarySkills = JSON.parse(resumeGet.secondarySkills);
        resumeGet.spokenLanguages = JSON.parse(resumeGet.spokenLanguages);
        // resumeGet.educationDetails = JSON.parse(resumeGet.educationDetails);
        resumeGet.educationDetails = convertFieldsDateFormat(
          JSON.parse(resumeGet.educationDetails)
        );
        setResume(resumeGet);
        setFields(resumeGet);
        // console.log(resumeGet);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Access denied to resume");
        navigate(`/upload`);
      });
  }, []);

  console.log(resume);

  const exportToExcel = () => {
    excelUtil.exportToExcelCustom(resume);
  };

  const downloadResume = async () => {
    fileUtil.firebaseFileDownload(resume.fileRef);
  };

  const handleResumeCompaniesDetailsChange = (newCompaniesDetail, index) => {
    const list = [...companiesDetails];
    list[index] = newCompaniesDetail;
    setCompaniesDetails(list);
  };

  const handleEducationDetailsChange = (newEducationDetail, index) => {
    const list = [...educationDetails];
    list[index] = newEducationDetail;
    setEducationDetails(list);
  };

  const deleteCompany = (index) => {
    console.log("deleting...");
    setCompaniesDetails((prev) => {
      const updatedList = prev.filter((company, i) => index !== i);
      return updatedList;
    });
  };

  const deleteEducation = (index) => {
    console.log("deleting...");
    setEducationDetails((prev) => {
      const updatedList = prev.filter((education, i) => index !== i);
      return updatedList;
    });
  };

  const handleCompaniesSwitch = (index, type) => {
    if (type === "UP") {
      if (index === 0) return;
      const list = [...companiesDetails];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      setCompaniesDetails(list);
    }

    if (type === "DOWN") {
      if (index === companiesDetails.length - 1) return;
      const list = [...companiesDetails];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      setCompaniesDetails(list);
    }
  };

  const handleEducationSwitch = (index, type) => {
    if (type === "UP") {
      if (index === 0) return;
      const list = [...educationDetails];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      setEducationDetails(list);
    }

    if (type === "DOWN") {
      if (index === educationDetails.length - 1) return;
      const list = [...educationDetails];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      setEducationDetails(list);
    }
  };

  return (
    <div className="container resume-container">
      {/* File Name */}
      <div class="resume-filename-section">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h3>Resume Name</h3>
            <AiFillEdit
              className="edit-icons-md"
              onClick={() =>
                setFileName((prev) => ({ ...prev, isEditing: !prev.isEditing }))
              }
            />
          </div>
          <input
            disabled={!fileName.isEditing}
            className="fileName-input"
            type="text"
            value={fileName.value}
            onChange={handleFileNameChange}
          />
          {!fileName.valid && (
            <div className="alert alert-danger mt-3">
              Resume Filename cannot be null
            </div>
          )}
        </div>
      </div>

      <div className="resume-main-section">
        <div class="resume-personal-details-section">
          {/* About me */}
          <div class="resume-details-part">
            <div className="d-flex align-items-center gap-2">
              <h3>About Me</h3>
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
            <textarea
              disabled={!profile.isEditing}
              className="textarea-input"
              type="text"
              value={profile.value}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, value: e.target.value }))
              }
            ></textarea>
          </div>

          {/* Firstname and lastname */}
          <div className="flex-form">
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>First Name</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setFirstName((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <input
                disabled={!firstName.isEditing}
                type="text"
                value={firstName.value}
                onChange={(e) =>
                  setFirstName((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </div>
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Last Name</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setLastName((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <input
                disabled={!lastName.isEditing}
                type="text"
                value={lastName.value}
                onChange={(e) =>
                  setLastName((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </div>
          </div>

          {/* <div class="resume-details-part">
            <div className="d-flex align-items-center gap-2">
              <h3>Name</h3>
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setName((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
            <input
              type="text"
              value={name.value}
              onChange={(e) =>
                setName((prev) => ({ ...prev, value: e.target.value }))
              }
              disabled={!name.isEditing}
            />
          </div> */}

          {/* //Email and mobile */}
          <div className="flex-form">
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Email</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setEmail((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <input
                type="text"
                value={email.value}
                onChange={(e) =>
                  setEmail((prev) => ({ ...prev, value: e.target.value }))
                }
                disabled={!email.isEditing}
              />
            </div>
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Mobile</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setMobile((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <div className="d-flex align-items-center justify-content-between gap-5">
                <input
                  type="text"
                  value={mobile.value}
                  onChange={(e) =>
                    setMobile((prev) => ({ ...prev, value: e.target.value }))
                  }
                  disabled={!mobile.isEditing}
                />
              </div>
            </div>
          </div>

          {/* Gender and nationality */}
          <div className="flex-form">
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Gender</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setGender((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <select
                className="select-input"
                value={gender.value}
                onChange={(e) =>
                  setGender((prev) => ({ ...prev, value: e.target.value }))
                }
                disabled={!gender.isEditing}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Nationality</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setNationality((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <div className="d-flex align-items-center justify-content-between gap-5">
                <input
                  type="text"
                  value={nationality.value}
                  onChange={(e) =>
                    setNationality((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  disabled={!nationality.isEditing}
                />
              </div>
            </div>
          </div>

          {/* Current Location and Years of experience */}
          <div className="flex-form">
            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Current Location</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setLocation((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <div className="d-flex align-items-center justify-content-between gap-5">
                <input
                  type="text"
                  value={location.value}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  disabled={!location.isEditing}
                />
              </div>
            </div>

            <div class="resume-details-part w-100">
              <div className="d-flex align-items-center gap-2">
                <h3>Years of Experience</h3>
                <AiFillEdit
                  className="edit-icons-md"
                  onClick={() =>
                    setYearsOfExp((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                />
              </div>
              <div className="d-flex align-items-center justify-content-between gap-5">
                <input
                  type="number"
                  value={yearsOfExp.value}
                  onChange={(e) =>
                    setYearsOfExp((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  disabled={!yearsOfExp.isEditing}
                />
              </div>
            </div>
          </div>

          {/* Highest Qualification */}
          <div class="resume-details-part">
            <div className="d-flex align-items-center gap-2">
              <h3>Highest Qualification</h3>
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setQualification((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
              <button
                className="show-companies"
                onClick={() => setShowEducationDetails(!showEducationDetails)}
              >
                Show more
                {showEducationDetails ? <AiFillCaretUp /> : <AiFillCaretDown />}
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-5">
              <input
                type="text"
                value={qualification.value}
                onChange={(e) =>
                  setQualification((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                disabled={!qualification.isEditing}
              />
            </div>
          </div>
          {showEducationDetails && (
            <div className="companies-details-card mb-3">
              <div className="text-end mb-3">
                <button
                  onClick={() =>
                    setEducationDetails((prev) => {
                      return [
                        {
                          name: "",
                          startDate: "",
                          endDate: "",
                          noOfYears: 0,
                          qualification: "",
                        },
                        ...prev,
                      ];
                    })
                  }
                  className="btn btn-secondary btn-sm"
                >
                  + Add an education
                </button>
              </div>
              {resume &&
                resume.educationDetails.length > 0 &&
                educationDetails.map((education, index) => {
                  return (
                    <ResumeEducationField
                      education={education}
                      index={index}
                      educationDetailsChange={handleEducationDetailsChange}
                      deleteEducation={deleteEducation}
                      switchContent={handleEducationSwitch}
                    />
                    // <div className="companies-details-single">
                    //   <p>
                    //     {index + 1}) Institution Name: {education.name}
                    //   </p>
                    //   <div className="companies-details-card-details">
                    //     <p>Qualification: {education.qualification}</p>
                    //     <p>Start Date: {education.startDate}</p>
                    //     <p>End Date: {education.endDate}</p>
                    //     <p>No of Years: {education.noOfYears.toFixed(1)}</p>
                    //   </div>
                    // </div>
                  );
                })}
            </div>
          )}

          {/* Spoken Languages */}
          <div class="resume-skills-section">
            <div className="d-flex align-items-center gap-2">
              <h3>Spoken Languages</h3>
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setSpokenLanguage((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
            <ResumeFieldInput
              data={spokenLanguage}
              setData={setSpokenLanguage}
              setDatas={setSpokenLanguages}
            />
            <ResumeFieldList
              data={spokenLanguages}
              deleteData={(selectedIndex) =>
                setSpokenLanguages((prev) =>
                  prev.filter(
                    (spokenLanguage, index) => index !== selectedIndex
                  )
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="resume-main-section mt-4">
        <div class="resume-companies-section mt-2">
          <div className="companies-container">
            <h3>Companies</h3>
            <button
              className="show-companies"
              onClick={() => setShowCompaniesDetails(!showCompaniesDetails)}
            >
              Show more
              {showCompaniesDetails ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </button>
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <span className="list-index">1)</span>
              <input
                disabled={!company1.isEditing}
                className="fileName-input"
                type="text"
                value={company1.value}
                onChange={(e) =>
                  setCompany1((prev) => ({ ...prev, value: e.target.value }))
                }
              />
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setCompany1((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <span className="list-index">2)</span>
              <input
                disabled={!company2.isEditing}
                className="fileName-input"
                type="text"
                value={company2.value}
                onChange={(e) =>
                  setCompany2((prev) => ({ ...prev, value: e.target.value }))
                }
              />
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setCompany2((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <span className="list-index">3)</span>
              <input
                disabled={!company3.isEditing}
                className="fileName-input"
                type="text"
                value={company3.value}
                onChange={(e) =>
                  setCompany3((prev) => ({ ...prev, value: e.target.value }))
                }
              />
              <AiFillEdit
                className="edit-icons-md"
                onClick={() =>
                  setCompany3((prev) => ({
                    ...prev,
                    isEditing: !prev.isEditing,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {showCompaniesDetails && (
          <div className="companies-details-card">
            <div className="text-end mb-3">
              <button
                onClick={() =>
                  setCompaniesDetails((prev) => {
                    return [
                      {
                        name: "",
                        startDate: "",
                        endDate: "",
                        noOfYears: 0,
                        jobTitle: "",
                        responsibilities: [],
                      },
                      ...prev,
                    ];
                  })
                }
                className="btn btn-secondary btn-sm"
              >
                + Add a company
              </button>
            </div>

            {companiesDetails.length > 0 &&
              companiesDetails.map((company, index) => {
                return (
                  <ResumeCompanyField
                    // key={index}
                    companiesDetailChange={handleResumeCompaniesDetailsChange}
                    company={company}
                    index={index}
                    deleteCompany={deleteCompany}
                    switchContent={handleCompaniesSwitch}
                  />
                  // <div className="companies-details-single">
                  //   <p>
                  //     {index + 1}) Company Name: {company.name}
                  //   </p>
                  //   <div className="companies-details-card-details">
                  //     <p>Designation: {company.jobTitle}</p>
                  //     <p>Start Date: {company.startDate}</p>
                  //     <p>End Date: {company.endDate}</p>
                  //     <p>No of Years: {company.noOfYears.toFixed(1)}</p>
                  //     <p className="mt-2 text-decoration-underline">
                  //       Responsibilities
                  //     </p>
                  //     <ul className="px-5">
                  //       {company.responsibilities.map((responsibility) => (
                  //         <li>{responsibility}</li>
                  //       ))}
                  //     </ul>
                  //   </div>
                  // </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="resume-main-section mt-4">
        {/* <div class="resume-skills-section">
          <div className="d-flex align-items-center gap-2">
            <h3>Skills</h3>
            <AiFillEdit
              className="edit-icons-md"
              onClick={() =>
                setSkill((prev) => ({
                  ...prev,
                  isEditing: !prev.isEditing,
                }))
              }
            />
          </div>
          <ResumeFieldInput data={skill} setData={setSkill} setDatas={setSkills}/>
          <ResumeFieldList data={skills} deleteData={deleteSkill}/>
        </div> */}

        <div class="resume-skills-section">
          <div className="d-flex align-items-center gap-2">
            <h3>Primary Skills</h3>
            <AiFillEdit
              className="edit-icons-md"
              onClick={() =>
                setPrimarySkill((prev) => ({
                  ...prev,
                  isEditing: !prev.isEditing,
                }))
              }
            />
          </div>
          <ResumeFieldInput
            data={primarySkill}
            setData={setPrimarySkill}
            setDatas={setPrimarySkills}
          />
          <ResumeFieldList
            data={primarySkills}
            deleteData={(selectedIndex) =>
              setPrimarySkills((prev) =>
                prev.filter((setPrimarySkill, index) => index !== selectedIndex)
              )
            }
          />
        </div>

        <div class="resume-skills-section mt-4">
          <div className="d-flex align-items-center gap-2">
            <h3>Secondary Skills</h3>
            <AiFillEdit
              className="edit-icons-md"
              onClick={() =>
                setSecondarySkill((prev) => ({
                  ...prev,
                  isEditing: !prev.isEditing,
                }))
              }
            />
          </div>
          <ResumeFieldInput
            data={secondarySkill}
            setData={setSecondarySkill}
            setDatas={setSecondarySkills}
          />
          <ResumeFieldList
            data={secondarySkills}
            deleteData={(selectedIndex) =>
              setSecondarySkills((prev) =>
                prev.filter(
                  (setSecondarySkill, index) => index !== selectedIndex
                )
              )
            }
          />
        </div>

        {/* Buttons */}
        <div className="text-center mt-5 d-flex gap-3 justify-content-center">
          <button className="btn btn-success" onClick={handleUpdateResume}>
            Update
          </button>
          <button className="btn btn-danger" onClick={handleDeleteResume}>
            Delete
          </button>

          {(ctx.getUserRole() === "ROLE_ADMIN" ||
            ctx.getUserRole() === "ROLE_PAID") && (
            <button className="btn btn-secondary" onClick={downloadResume}>
              Download Original Resume
            </button>
          )}
          {(ctx.getUserRole() === "ROLE_ADMIN" ||
            ctx.getUserRole() === "ROLE_PAID") && (
            <button className="btn btn-secondary" onClick={exportToExcel}>
              Export to excel
            </button>
          )}
          {resume && (
            <PDFDownloadLink
              document={<PDFDocument data={resume} />}
              className="btn btn-secondary btn"
              fileName={resume.filename + ".pdf"}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." :"PDF Resume"
              }
            </PDFDownloadLink>
          )}

          {(ctx.getUserRole() === "ROLE_ADMIN" ||
            ctx.getUserRole() === "ROLE_PAID") && (
            <button
              className="btn btn-secondary"
              onClick={() => wordUtil.generateDocx(resume)}
            >
              Word Resume
            </button>
          )}
        </div>
      </div>

      {/* {resume && (
        <Modal isOpen={true} ><PDFDocument data={resume} /></Modal>
      )} */}
    </div>
  );
};

export default Resume;
