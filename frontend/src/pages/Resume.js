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
    };

    resumeAPI.updateResume(resumeDetails).then((res) => {
      console.log(res.data);
      const resumeGet = { ...res.data };
      resumeGet.companiesDetails = JSON.parse(resumeGet.companiesDetails);
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
  };

  useEffect(() => {
    resumeAPI
      .getResume(params.userId, params.resumeId)
      .then((res) => {
        console.log(res.data);
        const resumeGet = { ...res.data };
        resumeGet.companiesDetails = JSON.parse(resumeGet.companiesDetails);
        setResume(resumeGet);
        // const resume = res.data;
        // Set Initial state
        setFields(resumeGet);
        console.log(resumeGet);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Access denied to resume");
        navigate(`/upload`);
      });
  }, []);

  const exportToExcel = () => {
    excelUtil.exportToExcelCustom(resume);
  };

  return (
    <div className="container resume-container w-50">
      <div class="resume-filename-section">
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
      <div className="resume-main-section">
        <div class="resume-personal-details-section">
          <div class="resume-details-part">
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
          </div>
          <div class="resume-details-part">
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
          <div class="resume-details-part">
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
          <div class="resume-details-part">
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
                  setYearsOfExp((prev) => ({ ...prev, value: e.target.value }))
                }
                disabled={!yearsOfExp.isEditing}
              />
            </div>
          </div>

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
        </div>

        <div class="resume-skills-section">
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
          <div>
            {skill.isEditing && (
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  value={skill.value}
                  onChange={(e) =>
                    setSkill((prev) => ({ ...prev, value: e.target.value }))
                  }
                  disabled={!skill.isEditing}
                  placeholder="Add a skill"
                  className="mt-1 mb-1"
                />
                <RiAddCircleFill
                  className="edit-icons-md"
                  onClick={() => {
                    setSkill((prev) => ({ ...prev, value: "" }));
                    setSkills((prev) => [...prev, skill.value]);
                  }}
                />
              </div>
            )}
          </div>
          <div class="skill-list d-flex gap-3 mt-3 flex-wrap">
            {skills.length === 0 && !skill.isEditing && (
              <div>No skills added</div>
            )}
            {skills.map((skill, index) => {
              return (
                <div class="skill-item d-flex gap-1 align-items-center">
                  <span>{skill}</span>
                  <RxCross2
                    class="skill-delete-icon"
                    onClick={() => deleteSkill(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div class="resume-companies-section mt-4">
          <div className="companies-container">
            <h3>Companies</h3>
            <button
              className="show-companies"
              onClick={() => setShowCompaniesDetails(!showCompaniesDetails)}
            >
              Show more <AiFillCaretDown />
            </button>
          </div>

          {/* {company1.value === "" && company2.value === "" && company3.value &&  <div>No Compa</div>}  */}
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
            {resume && resume.companiesDetails.length > 0 && resume.companiesDetails.map((company, index) => {
              return (
                <div className="companies-details-single">
                  <p>
                    {index + 1}) Company Name: {company.name}
                  </p>
                  <div className="companies-details-card-details">
                    <p>Start Date: {company.startDate}</p>
                    <p>End Date: {company.endDate}</p>
                    <p>No of Years: {company.noOfYears.toFixed(1)}</p>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        <div className="text-center mt-3 d-flex gap-3 justify-content-center">
          <button className="btn btn-success" onClick={handleUpdateResume}>
            Update
          </button>
          <button className="btn btn-danger" onClick={handleDeleteResume}>
            Delete
          </button>
          {(ctx.getUserRole() === "ROLE_ADMIN" ||
            ctx.getUserRole() === "ROLE_PAID") && (
              <button className="btn btn-secondary" onClick={exportToExcel}>
                Export to excel
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
