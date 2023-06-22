import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Login from './pages/Login'
import Upload from './pages/Upload';
import Register from './pages/Register';

import NavBar from './component/NavBar';
import UserResumes from './pages/UserResumes';

function App() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path ='/upload' element = {<Upload />}/>
                <Route path = '/register' element = {<Register />}/>
                <Route path = '/userresumes' element = {<UserResumes/>}/>
            </Routes>
        </Router>
    )
}

export default App;
