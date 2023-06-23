import React, { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";

const NotLoggedInGuard = ({ component }) => {
  // const navigate = useNavigate();
  const ctx = useContext(UserContext);

  if (ctx.isUserLoggedIn()) {
    return <Navigate to="/upload" />;
  }
  return component;
};

export default NotLoggedInGuard;
