import React, { useState } from 'react';
import './css/Login.css';
import logoAsset from './Assets/logoAsset.png';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log(`Registering with username: ${username} and password: ${password}`);
      // Proceed with registration...
    } else {
      console.log('Passwords do not match.');
    }
  }

  return (
    <div className="container">
      <div className="left-side">
        <img src={logoAsset} alt="Logo" />
        <h1>Resume parsing website</h1>
      </div>
      <div className="right-side">
        <form onSubmit={handleSubmit}>
          <table className="login-table">
            <tbody>
              <tr>
                <td>
                  <label>Email:</label>
                </td>
                <td>
                  <input type="email" value={email} onChange={handleEmailChange} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Username:</label>
                </td>
                <td>
                  <input type="text" value={username} onChange={handleUsernameChange} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Password:</label>
                </td>
                <td>
                  <input type="password" value={password} onChange={handlePasswordChange} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Confirm Password:</label>
                </td>
                <td>
                  <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <Link to="/login" className='registerHere'>Already have an account? Log in here</Link>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit">Register</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default Register;
