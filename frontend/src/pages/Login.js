import React, { useState } from 'react';
import './css/Login.css';
import logoAsset from './Assets/logoAsset.png';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameValid(e.target.value.length > 0);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in with username: ${username} and password: ${password}`);
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={logoAsset} alt="Logo" />
        <h1>Resume parsing website</h1>
      </div>
      <div className="right-side">
      <div className="d-flex justify-content-center">

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <table className="table login-table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="validationCustom01" className="form-label">Username:</label>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${usernameValid ? 'is-valid' : 'is-invalid'}`}
                    id="validationCustom01"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                  {usernameValid ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    <div className="invalid-feedback">Please type a username.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="validationServer02" className="form-label">Password:</label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${passwordValid ? 'is-valid' : 'is-invalid'}`}
                    id="validationServer02"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <div className="invalid-feedback">Please provide a password.</div>
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
