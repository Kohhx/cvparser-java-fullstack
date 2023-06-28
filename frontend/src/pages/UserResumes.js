import React, { useState, useEffect, useContext } from "react";
import "./css/UserResumes.css";
import "bootstrap/dist/css/bootstrap.css";
import ReactPaginate from "react-paginate";
import { resumeAPI } from "../api/resumeAPI";
import { UserContext } from "../context/userContext";
import detailsIcon from "./Assets/detailsIcon.png";
import deleteIcon from "./Assets/deleteIcon.png";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import { excelUtil } from "../utility/excelUtil";

const UserResumes = () => {
  const ctx = useContext(UserContext);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);
  const [userId, setUserId] = useState();
  const [resumes, setResumes] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const [totalResumes, setTotalResumes] = useState(0);

  const getResumes = () => {
    resumeAPI.getUserResumes(ctx.getUserId()).then((res) => {
      setResumes(res.data);
      console.log(res.data)
      setTotalResumes(res.data.length);
      setFilteredArray(res.data);
    });
  };

  useEffect(() => {
    console.log("userId", ctx.getUserId());
    setUserId(ctx.userDetails.id);
    getResumes();


  }, []);

  //Filtering useEffect
  useEffect(() => {
    const resumesArray = Object.values(resumes);
    const filteredResumes = resumesArray.filter((resume) => {
      if (searchSkills==="" && searchName==="") { 
        return resumes;
      }
      else if (searchSkills ==="" && searchName !="") {
        return (
        resume.filename.toLowerCase().includes(searchName.toLowerCase()));}
      else 
        return (
        resume.skills.some((skill) =>
        skill.toLowerCase().includes(searchSkills.toLowerCase())) 
        &&
        resume.filename.toLowerCase().includes(searchName.toLowerCase()));  
    })
    setFilteredArray(filteredResumes)
  },[searchName,searchSkills]);

  // Reset currentPage to 0 whenever filteredArray changes
  useEffect(() => {
    setCurrentPage(0);
  }, [filteredArray]);

  console.log("Resumes from this user", filteredArray); // Add this line to check resumes in the console.

  //Paginate
  const PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredArray.length / PER_PAGE);

  //Delete
  const handleDeleteResume = (resumeId) => {
    resumeAPI.deleteResume(resumeId).then(() => {
      toast.success("Resume deleted successfully.");
      getResumes();
    });
  };

  const exportToExcel = () => {
    console.log(filteredArray);
    excelUtil.exportToExcel(filteredArray);
  };

  return (
    <div
      className="container user-resumes-container"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div style={{ width: "85%" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="myresume-title">My Resumes</h1>
          <h4 className="total-resumes">Total Resumes: {totalResumes}</h4>
        </div>

        <div className="ml-auto ">
          <div className="search-container">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h4 className="mb-2">
                Filter <span>Resumes</span>
              </h4>
              {(ctx.getUserRole() === "ROLE_ADMIN" ||
                ctx.getUserRole() === "ROLE_PAID") && (
                <button onClick={exportToExcel} className="btn btn-secondary">
                  Export to excel
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Search by Resume Filename"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);}}
              className="mb-3 mt-2"
            />
            <input
              type="text"
              placeholder="Search by Skills"
              value={searchSkills}
              onChange={(e) => {
                setSearchSkills(e.target.value);}}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table table-responsive-sm table-fixed">
            <thead>
              <tr className="table-active table-primary">
                <th scope="col" colspan="2">
                  Filename
                </th>
                <th scope="col" colspan="4">
                  Skills
                </th>
                <th scope="col" colspan="2">
                  Created on
                </th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredArray
                .slice(offset, offset + PER_PAGE)
                .map((resumes) => {
                  // Custom formatting for YYYY-MM-DD HH:MM
                  const createdAt = new Date(resumes.createdAt);
                  const year = createdAt.getFullYear();
                  const month = String(createdAt.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(createdAt.getDate()).padStart(2, "0");
                  const hours = String(createdAt.getHours()).padStart(2, "0");
                  const minutes = String(createdAt.getMinutes()).padStart(
                    2,
                    "0"
                  );
                  const formattedCreatedAt = `${year}/${month}/${day} ${hours}:${minutes}`;

                  return (
                    <tr key={resumes.id}>
                      <th scope="row" colspan="2">
                        {resumes.filename}
                      </th>
                      <td colspan="4">{resumes.skills.join(", ")}</td>
                      <td colspan="2">{formattedCreatedAt}</td>
                      <td style={{ textAlign: "center" }}>
                        <Link
                          to={`/users/${ctx.getUserId()}/resumes/${resumes.id}`}
                        >
                          <img
                            src={detailsIcon}
                            alt="Details"
                            style={{ width: "24px", height: "24px" }}
                          ></img>
                        </Link>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Link onClick={() => handleDeleteResume(resumes.id)}>
                          <img
                            src={deleteIcon}
                            alt="Details"
                            style={{ width: "24px", height: "24px" }}
                          ></img>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "-20px" }}>
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            style={{
              width: `${80 * pageCount}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserResumes;
