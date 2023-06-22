import React,{ useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/userContext";

// Components
import Login from './pages/Login'
import Upload from './pages/Upload';
import Register from './pages/Register';
import UserResumes from './pages/UserResumes';
import UserDetails from './pages/UserDetails';
import NavBar from './components/shared/NavBar';
import './App.css';

function App() {
  const ctx = useContext(UserContext);
  return (
    <>
      <ToastContainer />
      {/* <UserContext.Provider value={value}> */}

    {/* const isUserLoggedIn = () => {
        //leave for Hexiang
    }; */}

        <Router>
            {ctx.isUserLoggedIn() && <NavBar />}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path ='/login' element = {<Login />}/>
                <Route path ='/upload' element = {<Upload />}/>
                <Route path = '/register' element = {<Register />}/>
                <Route path = '/users/:id/resumes' element = {<UserResumes/>}/>
                <Route path = '/userdetails' element = {<UserDetails/>}/>
            </Routes>
        </Router>
      {/* </UserContext.Provider> */}
    </>
  );
}

export default App;
