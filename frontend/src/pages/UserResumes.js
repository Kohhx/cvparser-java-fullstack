import React, { useState, useEffect, useContext } from "react";
import "./css/UserResumes.css";
import "bootstrap/dist/css/bootstrap.css";
import ReactPaginate from "react-paginate";
import { resumeAPI } from "../api/resumeAPI";
import { UserContext } from "../context/userContext";
import detailsIcon from "./Assets/detailsIcon.png";
import deleteIcon from "./Assets/deleteIcon.png";
const UserResumes = () => {
  const ctx = useContext(UserContext);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userId, setUserId] = useState();



  useEffect(() => {
    console.log(ctx.getUserId());
    setUserId(ctx.userDetails.id);
    resumeAPI.getUserResumes(ctx.getUserId()).then((res) => {
      console.log(res.data);
    });
  }, []);

  const PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(0);

  const candidates = [
    {
      filename: "Frontend_Resume",
      skills: ["Python", "Java", "HTML"],
      created: "2023-06-12 00:00:00.000000",
      details: "#details_20230901",
    },
    {
      filename: "Backend_Resume",
      skills: ["SQL", "VBA", "HTML"],
      created: "06/29/23",
      details: "#details_20230902",
    },
    {
      filename: "FrontendResume_FINAL_v2_new_updated_redux_imtryingmybest_iswearthisisthefinalupdate",
      skills: ["Python", "Java", "Ruby"],
      created: "06/01/23",
      details: "#details_20230915",
    },
    {
      filename: "Emmanuel_FrontEnd_Resume",
      skills: ["Logistics","Management","Python","Java","HTML","SQL","VBA","Project Management","Agile"],
      created: "03/12/23",
      details: "#details_20230904",
    },
    {
      filename: "EmmanuelBackEndResume",
      skills: ["Python", "Java", "C#"],
      created: "04/05/23",
      details: "#details_20230905",
    },
    {
      filename: "230623Resume",
      skills: ["Project Management", "Agile"],
      created: "04/15/23",
      details: "#details_20230906",
    },
    {
      filename: "230623",
      skills: ["SQL", "Python", "Java"],
      created: "04/18/23",
      details: "#details_20230907",
    },
    {
      filename: "FrontendResume_FINAL",
      skills: ["HTML", "CSS", "JavaScript"],
      created: "04/20/23",
      details: "#details_20230908",
    },
    {
      filename: "BackendResume_FINAL",
      skills: ["Python", "Java", "Ruby"],
      created: "05/03/23",
      details: "#details_20230909",
    },
    {
      filename: "FrontendResume_FINAL_v2",
      skills: ["PHP", "JavaScript", "HTML"],
      created: "05/09/23",
      details: "#details_20230910",
    },
    {
      filename: "FrontendResume_FINAL_v2_new",
      skills: ["SQL", "Python", "C#"],
      created: "05/10/23",
      details: "#details_20230911",
    },
    {
      filename: "FrontendResume_FINAL_v2_new_updated",
      skills: ["Angular", "React", "Vue.js"],
      created: "05/11/23",
      details: "#details_20230912",
    },
    {
      filename: "FrontendResume_FINAL_v2_new_updated_redux",
      skills: ["Project Management", "Agile"],
      created: "05/15/23",
      details: "#details_20230913",
    },
    {
      filename: "FrontendResume_FINAL_v2_new_updated_redux_imtryingmybest",
      skills: ["HTML", "CSS", "JavaScript"],
      created: "05/20/23",
      details: "#details_20230914",
    },
  ];
  
  const filteredCandidates = candidates.filter((candidate) => {
    return (
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchSkills.toLowerCase())) &&
      candidate.filename.toLowerCase().includes(searchName.toLowerCase()) &&
      candidate.created.includes(searchDate) // Date match is exact in this case
    )
    });


  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredCandidates.length / PER_PAGE);

  console.log("filteredCandidates:", filteredCandidates); // Add this line to check filtered candidates in the console.

  return (
    <div className="container" >
      <div className="ml-auto" style={{ marginTop: '80px' }}>
        <table className="table">
          <tbody>
            <tr>
              <td>
              <input type="text" placeholder="Search by Resume Filename" style={{width:'100%'}}
              value={searchName} onChange={e => setSearchName(e.target.value)} />
              </td>
            </tr>
            <tr>
            <td>
            <input type="text" placeholder="Search by Skills" style={{width:'100%'}}
            value={searchSkills} onChange={e => setSearchSkills(e.target.value)} />
            </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="table table-responsive-sm table-fixed" >
        <thead>
          <tr className="table-active table-primary">
            <th scope="col">Resume Filename</th>
            <th scope="col">Skills</th>
            <th scope="col">Created on</th>
            <th scope="col" colspan="2"></th>
          </tr>
        </thead>
        <tbody >
        {filteredCandidates
          .slice(offset, offset + PER_PAGE)
          .map((candidate) => {
            //Custom formatting for YYYY-MM-DD HH:MM
            const createdAt = new Date(candidate.created);
            const year = createdAt.getFullYear();
            const month = String(createdAt.getMonth() + 1).padStart(2, "0");
            const day = String(createdAt.getDate()).padStart(2, "0");
            const hours = String(createdAt.getHours()).padStart(2, "0");
            const minutes = String(createdAt.getMinutes()).padStart(2, "0");
            const formattedCreatedAt = `${year}-${month}-${day} ${hours}:${minutes}`;

            return (
              <tr key={candidate.filename}>
                <th scope="row">{candidate.filename}</th>
                <td>{candidate.skills.join(", ")}</td>
                <td>{formattedCreatedAt}</td>
                <td style={{textAlign:"center"}}>
                  {/* Change to YourResume link */}
                  <a href={candidate.details}>
                    <img src={detailsIcon} alt="Details" style={{ width: '24px', height: '24px'}}></img>
                  </a>
                </td>
                <td style={{textAlign:"center"}}>
                  {/* Change to YourResume link */}
                  <a href={candidate.details}>
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
  );
};



                            // <tr>
                            // <td>
                            //     <label>Date: </label>
                            // </td>
                            // <td>
                            //     <input type="text" placeholder="Search by Date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                            // </td>

                            // </tr>


export default UserResumes;
