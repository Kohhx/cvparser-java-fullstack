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
import { CSSTransition } from "react-transition-group";

function NavBar() {
  const ctx = useContext(UserContext);
  const [dropdown, setDropdown] = useState(false);
  const [uploadDropdown, setUploadDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const handleLogout = () => {
    authenticationAPI.logout();
    ctx.logoutUserDetails();
    navigate("/login");
  };

  const nodeRef = useRef();

  const dropdownBtn = useRef();
  const uploadDropdownBtn = useRef();

  useEffect(() => {
    userAPI.getUserDetails(ctx.getUserId()).then((res) => {
      console.log(res.data);
      setUser(res.data);
    });
  }, []);

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
  }, []);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (uploadDropdown && !uploadDropdownBtn.current?.contains(e.target)) {
        setUploadDropdown(false);
      }
    });

    return () =>
      document.removeEventListener("click", (e) => {
        setUploadDropdown(false);
      });
  }, []);

  const handleSubscriptionUpgrade = () => {
    console.log("upgrade");
    userAPI
      .updateUserToPaid(ctx.getUserId())
      .then((res) => {
        authenticationAPI.changeRole("ROLE_PAID");
        ctx.handleUserRole();
        toast.success("Successfully upgraded to paid subscription");
        setShowUpgradeModal(false);
      })
      .catch((err) => {
        toast.error("Error upgrading to paid subscription");
      });
  };

  const handleSubscriptionDowngrade = () => {
    console.log("downgrade");
    userAPI
      .updateUserToFree(ctx.getUserId())
      .then((res) => {
        authenticationAPI.changeRole("ROLE_FREE");
        ctx.handleUserRole();
        toast.success("Successfully downgraded to free subscription");
        setShowDowngradeModal(false);
      })
      .catch((err) => {
        toast.error("Error downgrading to free subscription");
      });
  };

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
            <h5>CV Parser</h5>
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

            {ctx.getUserRole() === "ROLE_FREE" && (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link-custom-active" : "nav-link-custom"
              }
              to="/upload"
            >
              Upload
            </NavLink>
            )}
            {/* {ctx.getUserRole() === "ROLE_PAID" && (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link-custom-active" : "nav-link-custom"
                }
                to="/upload-multi"
              >
                Upload Multi
              </NavLink>
            )} */}
            {(ctx.getUserRole() === "ROLE_PAID" || ctx.getUserRole() === "ROLE_ADMIN") && (
            <div className="dropdown" style={{ paddingRight: "10px" }}>
              <div
                className="dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => setUploadDropdown(!uploadDropdown)}
                ref={uploadDropdownBtn}
              >
              Upload
              </div>
              {uploadDropdown && (
                <div
                  className="dropdown-content"
                  aria-labelledby="dropdownMenuButton"
                >
                <div>
                  <NavLink
                  onClick={() => setUploadDropdown(false)}
                    className={({ isActive }) =>
                      isActive ? "nav-link-custom-active" : "nav-link-custom"
                    }
                    to="/upload"
                  >
                  Upload
                  </NavLink>
                </div>
                <div>
                  <NavLink
                     onClick={() => setUploadDropdown(false)}
                    className={({ isActive }) =>
                      isActive ? "nav-link-custom-active" : "nav-link-custom"
                    }
                    to="/upload-multi"
                  >
                  Upload Multi
                  </NavLink>
                </div>
                </div>
              )}
            </div>
            )}

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
          {/* {ctx.getUserRole()}
          {ctx.userDetails.role} */}
          <div className="d-flex gap-5 align-items-center">
            <span className="myName">
              Welcome, {user.firstName} {user.lastName}
            </span>
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
                  {ctx.getUserRole() === "ROLE_FREE" && (
                    <div onClick={() => setShowUpgradeModal(true)}>
                      Upgrade Subscription
                    </div>
                  )}
                  {ctx.getUserRole() === "ROLE_PAID" && (
                    <div onClick={() => setShowDowngradeModal(true)}>
                      Downgrade Subscription
                    </div>
                  )}
                  {ctx.getUserRole() === "ROLE_ADMIN" && (
                    <>
                      <div
                        onClick={() => {
                          setDropdown(false);
                          navigate("/admin/resumes?page=1&size=5");
                        }}
                      >
                        Manage Resumes
                      </div>
                      {/* <div>Manage Users</div> */}
                    </>
                  )}
                  <div onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* // Upgrade Subcription */}
      <CSSTransition
        in={showUpgradeModal}
        timeout={200}
        classNames="fadedown" // Classes for css transition in index.css
        unmountOnExit
      >
        <Modal
          isOpen={showUpgradeModal}
          closeModal={() => setShowUpgradeModal(false)}
        >
          <MdCancel
            className="cancel-icon"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="subscription-container">
            <h2>Upgrade Subcription</h2>
            <p className="subscription-type">Paid</p>
            <p className="subscription-price">$20.00 per month</p>
            <div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Unlimited resume upload and parsing</p>
              </div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Export to excel function</p>
              </div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Multiple resumes upload function</p>
              </div>
            </div>
            <button
              onClick={handleSubscriptionUpgrade}
              className="btn-rounded-solid mt-4"
            >
              Upgrade
            </button>
          </div>
        </Modal>
      </CSSTransition>

      {/* // Downgrade Subcription */}
      <CSSTransition
        in={showDowngradeModal}
        timeout={200}
        classNames="fadedown" // Classes for css transition in index.css
        unmountOnExit
      >
        <Modal
          isOpen={showDowngradeModal}
          closeModal={() => setShowDowngradeModal(false)}
        >
          <MdCancel
            className="cancel-icon"
            onClick={() => setShowDowngradeModal(false)}
          />
          <div className="subscription-container">
            <h2>Downgrade Subcription</h2>
            <p className="subscription-type">Free</p>
            <p className="subscription-price">$0</p>
            <div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Maximum of 5 resumes</p>
              </div>
            </div>
            <button
              onClick={handleSubscriptionDowngrade}
              className="btn-rounded-solid mt-4"
            >
              Downgrade
            </button>
          </div>
        </Modal>
      </CSSTransition>
    </>
  );
}

export default NavBar;
