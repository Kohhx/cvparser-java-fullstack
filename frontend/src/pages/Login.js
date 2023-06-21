import React, { useState } from 'react';
import './css/Login.css';
import logoAsset from './Assets/logoAsset.png';
import { Link } from 'react-router-dom';



const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in with username: ${username} and password: ${password}`);
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
                <td colSpan="2">
                  <Link to="/register" className='registerHere'>No account? Register here</Link>
                </td>
                
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit">Log in</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
