import React, { useEffect, useState } from "react";
import "./css/AdminManageResumes.css";
import { AiOutlineSearch } from "react-icons/ai";
import { resumeAPI } from "../api/resumeAPI";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { utils, write } from 'xlsx';
import { saveAs } from "file-saver";

const AdminManageResumes = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [resumes, setResumes] = useState([]);
  const [resumeExportData, setResumeExportData] = useState([]);

  // console.log(searchParams.get("page"));

  useEffect(() => {
    setPage(+searchParams.get("page"));
    resumeAPI
      .adminGetAllResumes(+searchParams.get("page"), searchInput)
      .then((res) => {
        console.log(res.data);
        setResumes(res.data.resumeList);
        setTotalPages(res.data.totalPages);
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
    resumeAPI.adminGetAllResumesSearch(1, e.target.value).then((res) => {
      console.log(res.data);
      setResumes(res.data.resumeList);
      setTotalPages(res.data.totalPages);
      setPage(1);
      navigate(`/admin/resumes?page=1&keywords=${e.target.value}`);
    });

    if (e.target.value === "") {
      resumeAPI
        .adminGetAllResumes(+searchParams.get("page"), e.target.value)
        .then((res) => {
          console.log(res.data);
          setResumes(res.data.resumeList);
          setTotalPages(res.data.totalPages);
          setPage(1);
          navigate(`/admin/resumes?page=1`);
        });
    }
  };

  const convertToJson = (resumes) => {
    const resumeDatas = resumes.map( resume => {
      return {
        email: resume.user.email,
        firstname: resume.user.firstName,
        lastname: resume.user.lastName,
        resume_file_name: resume.filename,
        resume_name: resume.name,
        resume_email: resume.email,
        resume_mobile: resume.mobile,
        resume_skills: resume.skills.join(', '),
        resume_companies: resume.companies.join(', '),
        resume_createdAt: resume.createdAt,
        resume_updatedAt: resume.UpdatedAt,
      }
    })
    setResumeExportData(resumeDatas)
    return resumeDatas
  }

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(convertToJson(resumes));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    const excelData = write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelData], { type: 'application/octet-stream' });
    saveAs(data, 'Resume_data.xlsx');
  };

  return (
    <div className="container admin-resume-container">
      <div class="table-card mt-4">
        <div className="table-card-container">
          <h1>Manage Resumes</h1>
          <div class="d-flex align-items-center justify-content-between p-4">
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
                <button type="submit" hidden>
                  submit
                </button>
              </form>
            </div>
            <button className="btn btn-primary" onClick={exportToExcel}>Export to file</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped-columns table-hover custom-table">
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
                {/* <th></th> */}
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
                    <Link
                      to={`/users/${resume.user.id}/resumes/${resume.id}`}
                      class="btn btn-secondary btn-custom"
                    >
                      View Resume
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div class="pagination">
            <span>
              {page} of {totalPages}
            </span>
            {page > 1 && (
              // <div class="arrow">
              //   <Link to={`/admin/resumes?page=${page - 1}`}>Prev</Link>
              // </div>
              <div class="arrow">
                <span onClick={() => goToPrev()}>Prev</span>
              </div>
            )}
            {page === 1 && <div class="arrow-disabled">Prev</div>}
            <span> {page} </span>
            {page < totalPages && (
              // <div class="arrow">
              //   <Link to={`/admin/resumes?page=${page + 1}`}>Next</Link>
              // </div>

              <div class="arrow">
                <span onClick={goToNext}>Next</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageResumes;
