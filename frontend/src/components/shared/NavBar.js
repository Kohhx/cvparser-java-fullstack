import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import navbarAsset from "./navbarAsset.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { authenticationAPI } from "../../api/authenticationAPI";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

function NavBar() {
  const ctx = useContext(UserContext);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    authenticationAPI.logout();
    ctx.logoutUserDetails();
    navigate("/login");
  };

  const dropdownBtn = useRef();

  useEffect(() => {
      document.addEventListener("click", (e) => {
        if (dropdown && !dropdownBtn.current?.contains(e.target)) {
           setDropdown(false);
        }
      });

    return () =>
      document.removeEventListener("click", (e) => {
        setDropdown(false);
      });
  });

  return (
    <nav className="navbar navbar-expand-lg fixed-top nav-container">
      <Link className="navbar-brand" to="/">
        <img
          src={navbarAsset}
          className="navbar-logo"
          style={{ paddingLeft: "30px" }}
          alt="Logo"
        />
        CV Parser
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <div className="navbar-nav">
          <Link
            className="nav-item nav-link btn btn-outline-primary my-2 my-sm-0 border-0"
            to="/upload"
          >
            Upload
          </Link>
          <Link
            className="nav-item nav-link btn btn-outline-primary my-2 my-sm-0 border-0"
            to={`/users/${ctx.getUserId()}/resumes`}
          >
            Your Resumes
          </Link>
        </div>
        <span onClick={handleLogout}>Logout</span>
        <div className="dropdown" style={{ paddingRight: "30px" }}>
          <button
            className="btn btn-success dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={() => setDropdown(!dropdown)}
            ref={dropdownBtn}
          >
            UserName
          </button>
          {dropdown && (
            <div
              className="dropdown-content"
              aria-labelledby="dropdownMenuButton"
            >
              <div onClick={handleLogout}>Logout</div>
              <div>Manage Resumes</div>
              <div>Manage Users</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
