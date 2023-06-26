import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/userContext";
import { Navigate } from "react-router-dom";

// Components
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Register from "./pages/Register";
import UserResumes from "./pages/UserResumes";
import UserDetails from "./pages/UserDetails";
import NavBar from "./components/shared/NavBar";
import NotLoggedInGuard from "./guards/NotLoggedInGuard";
import LogoutGuard from "./guards/LogoutGuard";
import FreePaidGuard from "./guards/FreePaidGuard";
import "./App.css";
import { pdfjs } from "react-pdf";
import Resume from "./pages/Resume";
import NavbarLayout from "./layout/NavbarLayout";
import AdminGuard from "./guards/AdminGuard";
import AdminManageResumes from "./pages/AdminManageResumes";

function App() {
  const ctx = useContext(UserContext);

  return (
    <>
      <ToastContainer />
      <Router>
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Routes protected by Logout Guard */}
            <Route element={<LogoutGuard />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<NavbarLayout />}>
              {/* Routes protected by FreePaid Guard */}
              <Route element={<FreePaidGuard />}>
                <Route path="/upload" element={<Upload />} />
                <Route
                  path="/users/:userId/resumes/:resumeId"
                  element={<Resume />}
                />
                <Route
                  path="/users/:userId/resumes"
                  element={<UserResumes />}
                />
                <Route path="/userdetails" element={<UserDetails />} />
              </Route>

              {/* // Admin Routes */}
              <Route element={<AdminGuard />}>
                <Route path="/admin/resumes" element={<AdminManageResumes />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
