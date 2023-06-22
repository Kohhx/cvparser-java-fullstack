import React,{ useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext, value } from "./context/userContext";

// Components
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Register from "./pages/Register";
import UserResumes from "./pages/UserResumes";

function App() {
  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={value}>
        <Router>
          {/* <Navbar /> */}

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userresumes" element={<UserResumes />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
