import React,{ useEffect, useState } from "react";
import "./css/AdminManageResumes.css";
import { AiOutlineSearch } from "react-icons/ai";
import { resumeAPI } from "../api/resumeAPI";


const AdminManageResumes = () => {
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    resumeAPI.adminGetAllResumes(page, searchInput).then((res) => {
      console.log(res.data)
    })
  },[])


  return (
    <div className="container admin-resume-container">
      <div class="table-card mt-4">
        <div className="table-card-container">
          <h1 >Manage Resumes</h1>
          <div class="d-flex align-items-center justify-content-between p-4">
            <div class="d-flex align-items-center gap-3">
              <form method="get" action="/list-employees?page=1&">
                <div class="search-bar-container d-flex align-items-center">
                  <AiOutlineSearch className="fa-magnifying-glass" />
                  <input class="search-bar-input" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" name="search" placeHolder="Search resume by skills or name"/>
                </div>
                <button type="submit" hidden>
                  submit
                </button>
              </form>
            </div>
            <button className="btn btn-primary">Export to file</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped-columns table-hover custom-table">
            <thead>
              <tr class="table-secondary">
                <th>Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th class="text-center">Resume Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Age</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* <td>${employee.id}</td>
                      <td>${employee.firstName}</td>
                      <td>${employee.lastName}</td>
                      <td>${employee.gender}</td>
                      <td>${employee.email}</td>
                      <td>${employee.age}</td>
                      <td>${employee.address}</td>
                      <td class="text-center">
                          <a href="employee/${employee.id}" class="btn btn-secondary btn-custom">View Profile</a>
                      </td> */}
              </tr>
            </tbody>
          </table>

          {/* <div class="pagination">
                <span>${page} of ${totalPages} </span>
                <c:if test="${page > 1}">
                    <div class="arrow"><a href="/list-employees?page=${page-1}&search=${search}"><<</a></div>
                </c:if>
                <c:if test="${page == 1}">
                    <div class="arrow-disabled"><<</div>
                </c:if>
                <span> ${page} </span>
                <c:if test="${page < totalPages}">
                    <div class="arrow"><a href="/list-employees?page=${page+1}&search=${search}">>></a></div>
                </c:if>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminManageResumes;
