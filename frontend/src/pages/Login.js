import React, { useState, useContext } from "react";
import "./css/Login.css";
import logoAsset from "./Assets/logoAsset.png";
import { Link } from "react-router-dom";
import { authenticationAPI } from "../api/authenticationAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import { UserContext } from "../context/userContext";
import LoginImg from "./Assets/images/login.png";

const LoginPage = () => {
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = (e) => {
    setEmailTouched(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = (e) => {
    setPasswordTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`Logging in with Email: ${email} and password: ${password}`);

    const userLoginDetail = {
      email,
      password,
    };

    authenticationAPI.login(userLoginDetail).then(() => {
      console.log("2");
      ctx.loginUserDetails();
      console.log(ctx.userDetails);
      navigate("/upload");
    });
  };

  return (
    <div className="login-container container d-flex">
      <div className="left-side d-flex">
      <img src={logoAsset} alt="Logo" />
        <div className="login-main-title">
            <h3>Avensys</h3>
            <div>
                <span class="right-header-1" id="first-line">CV Parser</span>
            </div>
        </div>

      </div>
      <div className="right-side">
        <div className="right-card">
          <div className="text-center">
            <img src={LoginImg} alt="login" className="login-icon mb-4"/>
            <h1 className="mb-5 login-title">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`input1 form-control ${
                  emailTouched && (email.length > 0 ? "is-valid" : "is-invalid")
                }`}
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
              />

              <label htmlFor="floatingInput">Email address</label>
              {emailTouched &&
                (email.length > 0 ? (
                  <div className="valid-feedback">Looks good!</div>
                ) : (
                  <div className="invalid-feedback">Please type a email.</div>
                ))}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${
                  passwordTouched &&
                  (password.length > 0 ? "is-valid" : "is-invalid")
                }`}
                id="floatingPassword"
                placeholder="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
              {passwordTouched && (
                <div className="invalid-feedback">
                  Please provide a password.
                </div>
              )}
            </div>
            <div className="form-group">
              No account? Please register <Link to="/register">here</Link>
            </div>
            <div className="form-group mt-3">
              <button type="submit" className="btn-rounded-outline">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
