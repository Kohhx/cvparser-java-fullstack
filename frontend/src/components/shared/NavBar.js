import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import navbarAsset from './navbarAsset.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem('username') || localStorage.getItem('user');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top nav-container">
      <Link className="navbar-brand" to="/">
        <img src={navbarAsset} className="navbar-logo" style={{ paddingLeft: '30px' }} alt="Logo" /> CV Parser
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
        <div className="navbar-nav">
          <Link className="nav-item nav-link btn btn-outline-primary my-2 my-sm-0 border-0" to="/upload">Upload</Link>
          <Link className="nav-item nav-link btn btn-outline-primary my-2 my-sm-0 border-0" to="/userresumes">Your Resume</Link>
        </div>
        {isUserLoggedIn() && (
          <div className="dropdown" style={{ paddingRight: '30px' }}>
            <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              UserName
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
