import React, { useState, useContext } from "react";
import "./css/Register.css";
import logoAsset from "./Assets/logoAsset.png";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";
import { authenticationAPI } from "../api/authenticationAPI";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";


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

  // const handleUsernameChange = (e) => {
  //   setUsername(e.target.value);
  // };

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

    authenticationAPI.signup(regData).then((res) => {
      toast.success("Registration successful.");
      navigate("/upload");
    } );
  };

  // };

  return (
    <div className="container d-flex">
      <div className="left-side">
        <img src={logoAsset} alt="Logo" />
      </div>
      <div className="right-side">
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <table className="table login-table rounded table-responsive-sm">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="firstNameInput">First Name:</label>
                </td>
                <td>
                <input
                    type="text"
                    className={`form-control ${firstNameTouched && (firstName.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="firstNameInput"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    onBlur={handleFirstNameBlur}
                    required
                  />
                  {firstName.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    firstNameTouched && <div className="invalid-feedback">Please provide a first name.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lastNameInput">Last Name:</label>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${lastNameTouched && (lastName.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="lastNameInput"
                    value={lastName}
                    onChange={handleLastNameChange}
                    onBlur={handleLastNameBlur}
                    required
                  />
                  {lastName.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    lastNameTouched && <div className="invalid-feedback">Please provide a last name.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="emailInput">Email:</label>
                </td>
                <td>
                  <input
                    type="email"
                    className={`form-control ${emailTouched && (email.length > 0 && email.includes('.com') && email.includes('@') ? 'is-valid' : 'is-invalid')}`}
                    id="emailInput"
                    value={email.value}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    required
                  />
                  {emailTouched && <div className="invalid-feedback">Please provide a valid email address.</div>}
                </td>
              </tr>
              {/* <tr>
                <td>
                  <label htmlFor="usernameInput">Username:</label>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${usernameTouched && (username.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="usernameInput"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    required
                  />
                  {username.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    usernameTouched && <div className="invalid-feedback">Please provide a username.</div>
                  )}
                </td>
              </tr> */}
              <tr>
                <td>
                  <label htmlFor="passwordInput">Password:</label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${passwordTouched && (password === confirmPassword && password.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="passwordInput"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  {password === confirmPassword ? (
                    <div className="valid-feedback">Passwords match!</div>
                  ) : (
                    passwordTouched && <div className="invalid-feedback">Passwords do not match.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="confirmPasswordInput">
                    Confirm Password:
                  </label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${confirmPasswordTouched && (password === confirmPassword && password.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="confirmPasswordInput"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    required
                  />
                  {password === confirmPassword ? (
                    <div className="valid-feedback">Passwords match!</div>
                  ) : (
                    confirmPasswordTouched && <div className="invalid-feedback">Passwords do not match.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <Link to="/" className="registerHere">
                    Already have an account? Log in here
                  </Link>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default Register;
