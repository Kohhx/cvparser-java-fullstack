import React, { useState } from 'react';
import './css/Register.css';
import logoAsset from './Assets/logoAsset.png';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log(`Registering with username: ${username} and password: ${password}`);
      // Proceed with registration...
    } else {
      console.log('Passwords do not match.');
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={logoAsset} alt="Logo" />
        <h1>Resume parsing website</h1>
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
                    className={`form-control ${firstName.length > 0 ? 'is-valid' : 'is-invalid'}`}
                    id="firstNameInput"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    required
                  />
                  {firstName.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    <div className="invalid-feedback">Please provide a first name.</div>
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
                    className={`form-control ${lastName.length > 0 ? 'is-valid' : 'is-invalid'}`}
                    id="lastNameInput"
                    value={lastName}
                    onChange={handleLastNameChange}
                    required
                  />
                  {lastName.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    <div className="invalid-feedback">Please provide a last name.</div>
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
                    className={`form-control ${email.length > 0 && email.includes('.com') && email.includes('@') ? 'is-valid' : 'is-invalid'}`}
                    id="emailInput"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <div className="invalid-feedback">Please provide a valid email address.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="usernameInput">Username:</label>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${username.length > 0 ? 'is-valid' : 'is-invalid'}`}
                    id="usernameInput"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                  {username.length > 0 ? (
                    <div className="valid-feedback">Looks good!</div>
                  ) : (
                    <div className="invalid-feedback">Please provide a username.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="passwordInput">Password:</label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${password === confirmPassword && password.length > 0 ? 'is-valid' : 'is-invalid'}`}
                    id="passwordInput"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  {password === confirmPassword ? (
                    <div className="valid-feedback">Passwords match!</div>
                  ) : (
                    <div className="invalid-feedback">Passwords do not match.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="confirmPasswordInput">Confirm Password:</label>
                </td>
                <td>
                  <input
                    type="password"
                    className={`form-control ${password === confirmPassword && password.length > 0 ? 'is-valid' : 'is-invalid'}`}
                    id="confirmPasswordInput"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  {password === confirmPassword ? (
                    <div className="valid-feedback">Passwords match!</div>
                  ) : (
                    <div className="invalid-feedback">Passwords do not match.</div>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <Link to="/" className="registerHere">Already have an account? Log in here</Link>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit" className="btn btn-primary">Register</button>
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
