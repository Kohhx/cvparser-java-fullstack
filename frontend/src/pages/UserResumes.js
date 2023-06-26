import React, { useState, useEffect, useContext } from "react";
import "./css/UserResumes.css";
import "bootstrap/dist/css/bootstrap.css";
import ReactPaginate from "react-paginate";
import { resumeAPI } from "../api/resumeAPI";
import { UserContext } from "../context/userContext";
import detailsIcon from "./Assets/detailsIcon.png";
import deleteIcon from "./Assets/deleteIcon.png";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const UserResumes = () => {
  const ctx = useContext(UserContext);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userId, setUserId] = useState();
  const [resumes,setResumes] = useState("");
  const params = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    console.log("userId",ctx.getUserId());
    setUserId(ctx.userDetails.id);
    resumeAPI.getUserResumes(ctx.getUserId()).then((res) => {
      setResumes(res.data);
    });
  }, []);

  //Table Mapping
  const resumesArray = Object.values(resumes);
  const filteredResumes = resumesArray.filter((resume) => {
    return (
      resume.skills.some((skill) => skill.toLowerCase().includes(searchSkills.toLowerCase())) &&
      resume.filename.toLowerCase().includes(searchName.toLowerCase())
    );
  });
  
  console.log("Resumes from this user", filteredResumes); // Add this line to check resumes in the console.

  //Paginate
  const PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredResumes.length / PER_PAGE);

  //Delete
  const handleDeleteResume = (resumeId) => {
    resumeAPI.deleteResume(resumeId).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="container" style={{display:'flex', justifyContent:'center'}} >
      <div style={{width:'85%'}}>
      <div className="ml-auto ">
        <table className="table">
          <tbody>
            <tr>
              <td style={{padding:'15px'}}>
              <input type="text" placeholder="Search by Resume Filename" 
              value={searchName} onChange={e => setSearchName(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td style={{padding:'15px'}}>
              <input type="text" placeholder="Search by Skills" 
              value={searchSkills} onChange={e => setSearchSkills(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="table table-responsive-sm table-fixed" >
        <thead>
          <tr className="table-active table-primary">
            <th scope="col" colspan="2">Filename</th>
            <th scope="col" colspan="4">Skills</th>
            <th scope="col" colspan="2">Created on</th>
            <th scope="col" colspan="2"></th>
          </tr>
        </thead>
        <tbody >
        {filteredResumes
          .slice(offset, offset + PER_PAGE)
          .map((resumes) => {
            // Custom formatting for YYYY-MM-DD HH:MM
            const createdAt = new Date(resumes.created);
            const year = createdAt.getFullYear();
            const month = String(createdAt.getMonth() + 1).padStart(2, "0");
            const day = String(createdAt.getDate()).padStart(2, "0");
            const hours = String(createdAt.getHours()).padStart(2, "0");
            const minutes = String(createdAt.getMinutes()).padStart(2, "0");
            const formattedCreatedAt = `${year}/${month}/${day} ${hours}:${minutes}`;

            return (
              <tr key={resumes.filename}>
                <th scope="row" colspan="2">{resumes.filename}</th>
                <td colspan="4">{resumes.skills.join(", ")}</td>
                <td colspan="2">{formattedCreatedAt}</td>
                <td style={{textAlign:"center"}}>
                  <a href={`/users/${ctx.getUserId()}/resumes/${resumes.id}`}>
                    <img src={detailsIcon} alt="Details" style={{ width: '24px', height: '24px'}}></img>
                  </a>
                </td>
                <td style={{textAlign:"center"}}>
                  <a onClick={()=>handleDeleteResume(resumes.id)}>
                    <img src={deleteIcon} alt="Details" style={{ width: '24px', height: '24px'}}></img>
                  </a>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
            
      <div>
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
          width:`${80*pageCount}px`
        }}
      />
      </div>
      </div>
    </div>
  );
};

export default UserResumes;
