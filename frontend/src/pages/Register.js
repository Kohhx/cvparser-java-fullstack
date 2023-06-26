import React, { useState, useContext } from "react";
import "./css/Register.css";
import logoAsset from "./Assets/logoAsset.png";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";
import { authenticationAPI } from "../api/authenticationAPI";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import RegisterImg from "./Assets/images/register.png";
import RegisterImg2 from "./Assets/images/register2.png";
import RegisterImg3 from "./Assets/images/register3.png";
import { RiAccountCircleFill } from "react-icons/ri";

const Register = () => {
  const navigate = useNavigate();
  const ctx = useContext(UserContext);
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState({
    value: "",
    touched: false,
    valid: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  // const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const handleFirstNameBlur = (e) => {
    setFirstNameTouched(true);
  };

  const handleLastNameBlur = (e) => {
    setLastNameTouched(true);
  };

  const handleEmailBlur = (e) => {
    setEmailTouched(true);
  };

  // const handleUsernameBlur = (e) => {
  //   setUsernameTouched(true);
  // };

  const handlePasswordBlur = (e) => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordBlur = (e) => {
    setConfirmPasswordTouched(true);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value) &&
      e.target.value.length > 0
    ) {
      setEmail({ ...email, value: e.target.value, valid: true });
      return;
    }
    setEmail({ ...email, value: e.target.value, valid: false });
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    }

    const regData = {
      firstName,
      lastName,
      email: email.value,
      password,
      role: "ROLE_FREE",
    };

    authenticationAPI
      .signup(regData)
      .then((res) => {
        toast.success("Registration successful.");
        navigate("/upload");
      }).catch((err) => {
        console.log(err);
        toast.error(
          err.response.data.message ||
            "Error in registration. Please try again."
        );
      });
  };

  return (
    <div className="register-container container d-flex">
      <div className="left-side">
        <img src={RegisterImg} alt="Logo" className="register-img img1" />
        <img src={RegisterImg2} alt="Logo" className="register-img img2" />
        <img src={RegisterImg3} alt="Logo" className="register-img img3" />
      </div>
      <div className="right-side">
        <form
          onSubmit={handleSubmit}
          className="right-card needs-validation"
          noValidate
        >
          <div className="d-flex gap-3 align-items-center register-form-container justify-content-center mb-4">
            <h2 className="register-title">Register</h2>
            <RiAccountCircleFill className="create-account-icon" />
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className={`input1 form-control ${
                firstNameTouched &&
                (firstName.length > 0 ? "is-valid" : "is-invalid")
              }`}
              id="firstNameInput"
              value={firstName}
              placeholder="Silas"
              onChange={handleFirstNameChange}
              onBlur={handleFirstNameBlur}
              required
            />
            <label htmlFor="firstNameInput">First Name:</label>
            {firstName.length > 0 ? (
              <div className="valid-feedback">Looks good!</div>
            ) : (
              firstNameTouched && (
                <div className="invalid-feedback">
                  Please provide a first name.
                </div>
              )
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${
                lastNameTouched &&
                (lastName.length > 0 ? "is-valid" : "is-invalid")
              }`}
              id="lastNameInput"
              value={lastName}
              placeholder="Yeak"
              onChange={handleLastNameChange}
              onBlur={handleLastNameBlur}
              required
            />
            <label htmlFor="lastNameInput">Last Name:</label>
            {lastName.length > 0 ? (
              <div className="valid-feedback">Looks good!</div>
            ) : (
              lastNameTouched && (
                <div className="invalid-feedback">
                  Please provide a last name.
                </div>
              )
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${
                emailTouched && (email.valid ? "is-valid" : "is-invalid")
              }`}
              id="emailInput"
              value={email.value}
              placeholder="silasyeak@gmail.com"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
            />
            <label htmlFor="emailInput">Email:</label>
            {email.valid ? (
              <div className="valid-feedback">Looks good!</div>
            ) : (
              emailTouched && (
                <div className="invalid-feedback">
                  Please provide a valid email address.
                </div>
              )
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${
                passwordTouched &&
                (password === confirmPassword && password.length > 0
                  ? "is-valid"
                  : "is-invalid")
              }`}
              id="passwordInput"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              required
            />
            <label htmlFor="passwordInput">Password:</label>
            {password === confirmPassword ? (
              <div className="valid-feedback">Passwords match!</div>
            ) : (
              passwordTouched && (
                <div className="invalid-feedback">Passwords do not match.</div>
              )
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${
                confirmPasswordTouched &&
                (password === confirmPassword && password.length > 0
                  ? "is-valid"
                  : "is-invalid")
              }`}
              id="confirmPasswordInput"
              placeholder="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              required
            />
            <label htmlFor="confirmPasswordInput">Confirm Password:</label>
            {password === confirmPassword ? (
              <div className="valid-feedback">Passwords match!</div>
            ) : (
              confirmPasswordTouched && (
                <div className="invalid-feedback">Passwords do not match.</div>
              )
            )}
          </div>

          <div className="mb-3">
            <span> Already have an account? Log in </span>

            <Link to="/" className="registerHere">
              <span>here</span>
            </Link>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn-rounded-outline w-100">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
