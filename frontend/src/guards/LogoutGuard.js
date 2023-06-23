import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet } from 'react-router-dom'


const LogoutGuard = () => {
  const ctx = useContext(UserContext);
  return ctx.isUserLoggedIn() ?  <Navigate to="/upload" /> : <Outlet />
}

export default LogoutGuard
