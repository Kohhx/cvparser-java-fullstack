import React, { useState, useEffect, useContext } from "react";
import "./css/UserResumes.css";
import "bootstrap/dist/css/bootstrap.css";
import ReactPaginate from "react-paginate";
import { resumeAPI } from "../api/resumeAPI";
import { UserContext } from "../context/userContext";

const UserResumes = () => {
  const ctx = useContext(UserContext);

  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userId, setUserId] = useState();

  useEffect(() => {
    // console.log(ctx.getUserId());
    setUserId(ctx.userDetails.id);
    resumeAPI.getUserResumes(ctx.getUserId()).then((res) => {
      console.log(res.data);
    });
  }, []);

  const PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(0);

  const candidates = [
    {
      name: "Mark Lim",
      skills: "Python, Java, HTML",
      created: "06/12/23",
      details: "#details_20230901",
    },
    {
      name: "Koh He Xiang",
      skills: "SQL, VBA, HTML",
      created: "06/29/23",
      details: "#details_20230902",
    },
    {
      name: "James Thiah",
      skills: "Logistics, Management",
      created: "03/12/23",
      details: "#details_20230904",
    },
    {
      name: "Emma Watson",
      skills: "Python, Java, C#",
      created: "04/05/23",
      details: "#details_20230905",
    },
    {
      name: "Tom Cruise",
      skills: "Project Management, Agile",
      created: "04/15/23",
      details: "#details_20230906",
    },
    {
      name: "Natalie Portman",
      skills: "SQL, Python, Java",
      created: "04/18/23",
      details: "#details_20230907",
    },
    {
      name: "Brad Pitt",
      skills: "HTML, CSS, JavaScript",
      created: "04/20/23",
      details: "#details_20230908",
    },
    {
      name: "Scarlett Johansson",
      skills: "Python, Java, Ruby",
      created: "05/03/23",
      details: "#details_20230909",
    },
    {
      name: "Jennifer Aniston",
      skills: "PHP, JavaScript, HTML",
      created: "05/09/23",
      details: "#details_20230910",
    },
    {
      name: "Leonardo DiCaprio",
      skills: "SQL, Python, C#",
      created: "05/10/23",
      details: "#details_20230911",
    },
    {
      name: "Johnny Depp",
      skills: "Angular, React, Vue.js",
      created: "05/11/23",
      details: "#details_20230912",
    },
    {
      name: "Keanu Reeves",
      skills: "Project Management, Agile",
      created: "05/15/23",
      details: "#details_20230913",
    },
    {
      name: "Morgan Freeman",
      skills: "HTML, CSS, JavaScript",
      created: "05/20/23",
      details: "#details_20230914",
    },
    {
      name: "Robert Downey Jr.",
      skills: "Python, Java, Ruby",
      created: "06/01/23",
      details: "#details_20230915",
    },
  ];

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchName.toLowerCase()) &&
      candidate.skills.toLowerCase().includes(searchSkills.toLowerCase()) &&
      candidate.created.includes(searchDate) // Date match is exact in this case
  );

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredCandidates.length / PER_PAGE);

  console.log("filteredCandidates:", filteredCandidates); // Add this line to check filtered candidates in the console.

  return (
    <div className="container">
      <div>
        <label htmlFor="" className="form-label">Filter Resume Name</label>
        <input type="text" className="form-control" placeholder="Search by Name"/>
      </div>

            <div className='row d-flex justify-content-center left-side'>
                <div class="col-auto">
                    <table className="table table-bordered">
                        <thead>
                            <tr className="table-active table-primary">
                                <th scope="col">Candidate</th>
                                <th scope="col">Skills</th>
                                <th scope="col">Created on</th>
                                <th scope="col">User details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates
                                .slice(offset, offset + PER_PAGE)
                                .map(candidate => (
                                <tr key={candidate.name}>
                                    <th scope="row">{candidate.name}</th>
                                    <td>{candidate.skills}</td>
                                    <td>{candidate.created}</td>
                                    <td><a href={candidate.details}>Details</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                />
            </div>

      {/* <div className="ml-auto right-side">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                <label>Name: </label>
                            </td>
                            <td>
                                <input type="text" placeholder="Search by Name" value={searchName} onChange={e => setSearchName(e.target.value)} />
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <label>Skills: </label>
                            </td>
                            <td>
                                <input type="text" placeholder="Search by Skills" value={searchSkills} onChange={e => setSearchSkills(e.target.value)} />
                            </td>

                            </tr>
                            <tr>
                            <td>
                                <label>Date: </label>
                            </td>
                            <td>
                                <input type="text" placeholder="Search by Date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                            </td>

                            </tr>


                    </tbody>
                </table>
            </div> */}
    </div>
  );
};

export default UserResumes;
