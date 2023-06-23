import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const FreePaidGuard = () => {
  const ctx = useContext(UserContext);
  console.log(ctx.getUserRole());
  return !ctx.isUserLoggedIn() &&
    ctx.getUserRole() !== "ROLE_FREE" &&
    ctx.getUserRole() !== "ROLE_PAID" ? (
    <Navigate to="/login" />
  ) : (
    <Outlet />
  );
};

export default FreePaidGuard;
