import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Login from './pages/Login'
import Upload from './pages/Upload';
import Register from './pages/Register';
import UserResumes from './pages/UserResumes';
import UserDetails from './pages/UserDetails';
import './App.css';

function App() {
    return (
        <Router>
            {/* <Navbar /> */}
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
