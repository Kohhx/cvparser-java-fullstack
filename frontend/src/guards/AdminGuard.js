import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const ctx = useContext(UserContext);
  console.log(ctx.getUserRole());
  return !ctx.isUserLoggedIn() &&
    ctx.getUserRole() !== "ROLE_ADMIN" ? (
    <Navigate to="/upload" />
  ) : (
    <Outlet />
  );
};

export default AdminGuard;
