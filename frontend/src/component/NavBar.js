import React, { useEffect, useState } from 'react';
//import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import { Link } from 'react-router-dom';


function NavBar() {
  //const location = useLocation();
  //const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  /* useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedUser);
  }, [location]); */

  return (
    <div className='nav-container'>

    
    <Navbar expand="lg" className="fixed-top nav-container" >
      <Navbar.Brand className="navbar-brand" href="/welcome">
        <Image src="/logo1.png" className='navbar-logo' style={{ paddingLeft: '30px' }}/> CV Parser
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
        <Nav className="mr-auto">
          
          <button class="btn btn-outline-primary my-2 my-sm-0 border-0"><Nav.Link href="/upload">Upload</Nav.Link></button>
          <button class="btn btn-outline-primary my-2 my-sm-0 border-0"><Nav.Link href="/resumeuser">Your Resume</Nav.Link></button>          
          {/* {user.role.toLowerCase() === 'admin' && <Nav.Link href="/Adminpanel">Admin Controls</Nav.Link>} */}
        </Nav>
        <Dropdown className="dropdown" style={{ paddingRight: '30px' }}>
          <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle'>
            
            <span>
              UserName{/* user.username */}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
    </div>
   
  


    
    /* location.pathname !== '/login' && location.pathname !== '/register' && user && (
      
    ) */
  );
}

export default NavBar;
