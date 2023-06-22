import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Login from './pages/Login'
import Upload from './pages/Upload';
import Register from './pages/Register';
import UserResumes from './pages/UserResumes';
import UserDetails from './pages/UserDetails';
import NavBar from './components/shared/NavBar';
import './App.css';

function App() {
    const isUserLoggedIn = () => {
        //leave for Hexiang
    };
  
    return (
        <Router>
            {isUserLoggedIn() && <NavBar />}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path ='/login' element = {<Login />}/> 
                <Route path ='/upload' element = {<Upload />}/>
                <Route path = '/register' element = {<Register />}/>
                <Route path = '/userresumes' element = {<UserResumes/>}/>
                <Route path = '/userdetails' element = {<UserDetails/>}/>
            </Routes>
        </Router>
    )
}

export default App;
