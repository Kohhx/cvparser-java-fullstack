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
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
function App() {
  const ctx = useContext(UserContext);

  return (
    <>
      <ToastContainer />
      <Router>
        {ctx.isUserLoggedIn() && <NavBar />}
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Routes protected by Logout Guard */}
            <Route element={<LogoutGuard />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Routes protected by FreePaid Guard */}
            <Route element={<FreePaidGuard />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/users/:id/resumes" element={<UserResumes />} />
              <Route path="/userdetails" element={<UserDetails />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
