import React, { useState, useContext } from 'react';
import './css/Login.css';
import logoAsset from './Assets/logoAsset.png';
import { Link } from 'react-router-dom';
import { authenticationAPI } from "../api/authenticationAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.css';
import { UserContext } from '../context/userContext';


const LoginPage = () => {
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameBlur = (e) => {
    setUsernameTouched(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = (e) => {
    setPasswordTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in with username: ${email} and password: ${password}`);

    const userLoginDetail = {
      email,
      password,
    }

    authenticationAPI.login(userLoginDetail).then(() => {
      console.log("2")
      ctx.loginUserDetails();
      console.log(ctx.userDetails);
      navigate("/upload");
    })

  };

  return (
    <div className="container d-flex">
      <div className="left-side">
        <img src={logoAsset} alt="Logo" />
      </div>
      <div className="right-side">
      <div className="d-flex justify-content-center">

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <table className="table login-table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="validationCustom01" className="form-label">Email:</label>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${usernameTouched && (username.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="validationCustom01"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    required
                  />
                  {usernameTouched && (username.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    <div className="invalid-feedback">Please type a username.</div>
                  ))}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="validationServer02" className="form-label">Password:</label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${passwordTouched && (password.length > 0 ? 'is-valid' : 'is-invalid')}`}
                    id="validationServer02"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  {passwordTouched && <div className="invalid-feedback">Please provide a password.</div>}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <Link to="/register" className="registerHere">No account? Register here</Link>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit" className="btn btn-primary">Log in</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        </div>
        </div>
      </div>
  );
};

export default LoginPage;
