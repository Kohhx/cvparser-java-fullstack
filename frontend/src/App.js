import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Login from './pages/Login'
import Upload from './pages/Upload';
import Register from './pages/Register';

function App() {
    return (
        <Router>
            {/* <Navbar /> */}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path ='/upload' element = {<Upload />}/>
                <Route path = '/register' element = {<Register />}/>
            </Routes>
        </Router>
    )
}

export default App;
