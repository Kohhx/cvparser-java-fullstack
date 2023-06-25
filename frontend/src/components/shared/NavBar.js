import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import navbarAsset from "./navbarAsset.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { authenticationAPI } from "../../api/authenticationAPI";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { PiSquaresFourFill } from "react-icons/pi";
import Modal from "../shared/Modal";
import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import { userAPI } from "../../api/userAPI";
import { toast } from "react-toastify";

function NavBar() {
  const ctx = useContext(UserContext);
  const [dropdown, setDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleSubscriptionUpgrade = () => {
    console.log("upgrade")
    userAPI.updateUserToPaid(ctx.getUserId()).then((res) => {
      authenticationAPI.changeRole('ROLE_PAID')
      toast.success("Successfully upgraded to paid subscription");
      setShowModal(false)
    })
    .catch((err) => {
      toast.error("Error upgrading to paid subscription");
    })
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top nav-container nav-custom">
        <NavLink
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src={navbarAsset}
            className="navbar-logo"
            style={{ paddingLeft: "30px" }}
            alt="Logo"
          />
          <div class="logo-text">
            <h6>Avensys</h6>
            <h5>CSV Parser</h5>
          </div>
        </NavLink>
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
          <div className="navbar-nav d-flex align-items-center gap-3">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link-custom-active" : "nav-link-custom"
              }
              to="/upload"
            >
              Upload
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "nav-link-custom nav-link-custom-active"
                  : "nav-link-custom"
              }
              to={`/users/${ctx.getUserId()}/resumes`}
            >
              Your Resumes
            </NavLink>
          </div>
          {ctx.getUserRole() }
          <div className="dropdown" style={{ paddingRight: "30px" }}>
            <div
              className="dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setDropdown(!dropdown)}
              ref={dropdownBtn}
            >
              <PiSquaresFourFill className="square-four-icon" />
            </div>
            {dropdown && (
              <div
                className="dropdown-content"
                aria-labelledby="dropdownMenuButton"
              >
                <div onClick={() => setShowModal(true)}>
                  Upgrade Subscription
                </div>
                <div>Manage Resumes</div>
                <div>Manage Users</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
        <MdCancel className="cancel-icon" onClick={() => setShowModal(false)}/>
        <div className="subscription-container">
          <h2>Upgrade Subcription</h2>
          <p className="subscription-type">Paid</p>
          <p className="subscription-price">$20.00 per month</p>
          <div>
            <div className="d-flex align-items-center">
              <TiTick className="tick-icon" />
              <p>Unlimited resume upload</p>
            </div>
            <div className="d-flex align-items-center">
              <TiTick className="tick-icon" />
              <p>Unlimited resume parsing</p>
            </div>
          </div>
          <button onClick={handleSubscriptionUpgrade} className="btn-rounded-solid mt-4">Upgrade</button>
        </div>
      </Modal>
    </>
  );
}

export default NavBar;
