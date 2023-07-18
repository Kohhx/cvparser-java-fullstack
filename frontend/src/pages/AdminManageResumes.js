import React, { useEffect, useState, useRef } from "react";
import "./css/AdminManageResumes.css";
import { AiOutlineSearch } from "react-icons/ai";
import { resumeAPI } from "../api/resumeAPI";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { toast } from "react-toastify";
import ResumeStatistics from "./Chart";
import { fileUtil } from "../utility/fileUtil";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../utility/PDFDocument";
import { BsThreeDotsVertical } from "react-icons/bs";
import DotMenu from "../components/DotMenu";
import DotMenu2 from "../components/DotMenu2";
import { excelUtil } from "../utility/excelUtil";

const AdminManageResumes = () => {
  const pdfLinkRef = useRef([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [resumes, setResumes] = useState([]);
  const [resumeExportData, setResumeExportData] = useState([]);
  const [size, setSize] = useState(5);
  const [showStats, setShowStats] = useState(false);
  const [dotMenu, setDotMenu] = useState(false);

  // console.log(searchParams.get("page"));

  const handleShowStats = () => {
    setShowStats((prevShowStats) => !prevShowStats);
  };

  const mapResumes = (resumes) => {
    return resumes.map((resume) => {
      resume.companiesDetails = JSON.parse(resume.companiesDetails);
      resume.primarySkills = JSON.parse(resume.primarySkills);
      resume.secondarySkills = JSON.parse(resume.secondarySkills);
      resume.spokenLanguages = JSON.parse(resume.spokenLanguages);
      resume.educationDetails = JSON.parse(resume.educationDetails);
      return resume;
    });
  };

  useEffect(() => {
    setPage(+searchParams.get("page"));
    resumeAPI
      .adminGetAllResumes(+searchParams.get("page"), searchInput, size)
      .then((res) => {
        console.log(res.data);
        setResumes(mapResumes(res.data.resumeList));
        setTotalPages(res.data.totalPages);
        // setSize(+searchParams.get("size"))
      });
  }, [page]);

  const goToPrev = () => {
    navigate(`/admin/resumes?page=${page - 1}`);
    setPage((prev) => prev - 1);
  };

  const goToNext = () => {
    navigate(`/admin/resumes?page=${page + 1}`);
    setPage((prev) => prev + 1);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    resumeAPI.adminGetAllResumesSearch(1, e.target.value, size).then((res) => {
      console.log(res.data);
      setResumes(mapResumes(res.data.resumeList));
      setTotalPages(res.data.totalPages);
      setPage(1);
      navigate(`/admin/resumes?page=1&keywords=${e.target.value}&size=${size}`);
    });

    if (e.target.value === "") {
      resumeAPI
        .adminGetAllResumes(+searchParams.get("page"), e.target.value, size)
        .then((res) => {
          console.log(res.data);
          setResumes(res.data.resumeList);
          setTotalPages(res.data.totalPages);
          setPage(1);
          navigate(`/admin/resumes?page=1&size=${size}`);
        });
    }
  };


  const handleResumeDelete = (userId, resumeId) => {
    // console.log("Resume id: ",id)
    resumeAPI.adminDeleteResume(userId, resumeId).then((res) => {
      resumeAPI.adminGetAllResumes(page, searchInput, size).then((res) => {
        console.log(res.data);
        setResumes(mapResumes(res.data.resumeList));
        setTotalPages(res.data.totalPages);
      });
      toast.success("Resume deleted successfully.");
    });
  };

  const handleSizeChange = (e) => {
    if (e.target.value === "") {
      setSize(5);
      return;
    }
    setSize((prev) => e.target.value);
    resumeAPI
      .adminGetAllResumes(
        +searchParams.get("page"),
        searchInput,
        e.target.value
      )
      .then((res) => {
        console.log(res.data);
        setResumes(mapResumes(res.data.resumeList));
        setTotalPages(res.data.totalPages);
      });
  };

  return (
    <div className=" admin-resume-container ">
      <div class="table-card mt-4">
        <div className="table-card-container">
          <h1>Manage Resumes</h1>
          <div class="d-flex align-items-center justify-content-between p-2 mb-3">
            <div class="d-flex align-items-center gap-3">
              <form method="get" action="/list-employees?page=1&">
                <div class="search-bar-container d-flex align-items-center">
                  <AiOutlineSearch className="fa-magnifying-glass" />
                  <input
                    class="search-bar-input"
                    value={searchInput}
                    onChange={handleInputChange}
                    type="text"
                    name="search"
                    placeHolder="Search resume by skills or name"
                  />
                </div>
                {/* <button type="submit" hidden>
                  submit
                </button> */}
              </form>
              <button
                type="btn"
                className="btn btn-primary"
                style={{ color: "white", marginLeft: "5px" }}
                onClick={handleShowStats}
              >
                Toggle Statistics
              </button>
            </div>
            <div className="d-flex gap-2">
              <input
                onChange={handleSizeChange}
                type="number"
                value={size}
                min="5"
                max="50"
                step="5"
                placeholder="Count per page"
                className="count-input"
              />
              <button
                className="btn btn-secondary btn-custom"
                onClick={() => excelUtil.exportToExcel(resumes)}
              >
                Export to excel
              </button>
            </div>
          </div>
        </div>
        {showStats && (
          <div className="resume-statistics">
            <h2>Resumes Statistics</h2>
            <div>
              <ResumeStatistics resumes={resumes} />
            </div>
          </div>
        )}

        <br></br>

        <div class="table-responsive back">
          <table class="table table-striped-columns custom-table back">
            <thead>
              <tr class="table-secondary">
                {/* <th>Id</th> */}
                <th>First Name</th>
                <th>Last Name</th>
                <th>Name</th>
                <th class="text-center">Resume Name</th>
                <th class="text-center">Email</th>
                <th>Mobile</th>
                <th>No of Employment Experience(Years)</th>
                <th>Skills</th>
                <th></th>
                <th></th>
                <th></th>
                {/* <th></th>
                <th></th> */}
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume, index) => (
                <tr>
                  {/* <td>{index + 1}</td> */}
                  <td>{resume.user.firstName}</td>
                  <td>{resume.user.lastName}</td>
                  <td>{resume.name}</td>
                  <td>{resume.filename}</td>
                  <td>{resume.email}</td>
                  <td>{resume.mobile}</td>
                  <td>{resume.yearsOfExperience}</td>
                  <td>{resume.skills.join(", ")}</td>
                  <td class="text-center">
                    <Link to={`/users/${resume.user.id}/resumes/${resume.id}`}>
                      <BsFillFileEarmarkTextFill className="icon" />
                    </Link>
                  </td>
                  <td class="text-center">
                    <AiTwotoneDelete
                      className="icon icon-delete"
                      onClick={() =>
                        handleResumeDelete(resume.user.id, resume.id)
                      }
                    />
                  </td>

                  <td class="text-center">
                    <DotMenu2>
                      <div
                        className={index+1 !== resumes.length ? "dot-menu" : "dot-menu dot-menu-flip"}
                        onMouseLeave={() => setDotMenu(false)}
                      >
                        <p
                          onClick={() => excelUtil.exportToExcelCustom(resume)}
                          className="border-b"
                        >
                          Download Excel
                        </p>
                        <p
                          onClick={() =>
                            fileUtil.firebaseFileDownload(resume.fileRef)
                          }
                          className="border-b"
                        >
                          Download Resume
                        </p>
                        <p onClick={() => pdfLinkRef.current[index].click()}>
                          Download Avensys Resume2
                        </p>
                      </div>
                    </DotMenu2>
                  </td>
                  <div className="hidden">
                    {resume && (
                      <PDFDownloadLink
                        document={<PDFDocument data={resume} />}
                        fileName={resume.filename + ".pdf"}
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            "Loading document..."
                          ) : (
                            <div
                              ref={(element) =>
                                (pdfLinkRef.current[index] = element)
                              }
                            >
                              <BsFillFileEarmarkArrowDownFill className="icon" />
                            </div>
                          )
                        }
                      </PDFDownloadLink>
                    )}
                  </div>

                </tr>
              ))}
            </tbody>
          </table>

          {/* <div class="pagination">
            <span>
              {page} of {totalPages}
            </span>
            {page > 1 && (
              <div class="arrow">
                <span className="prev-arrow" onClick={() => goToPrev()}>
                  Prev
                </span>
              </div>
            )}
            {page === 1 && <div class="arrow-disabled-2">Prev</div>}
            <span> {page} </span>
            {page < totalPages && (
              <div class="arrow">
                <span onClick={goToNext}>Next</span>
              </div>
            )}
          </div> */}
        </div>
        <div class="pagination">
          <span>
            {page} of {totalPages}
          </span>
          {page > 1 && (
            <div class="arrow">
              <span className="prev-arrow" onClick={() => goToPrev()}>
                Prev
              </span>
            </div>
          )}
          {page === 1 && <div class="arrow-disabled-2">Prev</div>}
          <span> {page} </span>
          {page < totalPages && (
            <div class="arrow">
              <span onClick={goToNext}>Next</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageResumes;
