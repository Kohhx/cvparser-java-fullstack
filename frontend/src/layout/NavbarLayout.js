import React, { useContext } from "react";
import NavBar from "../components/shared/NavBar";
import { UserContext } from "../context/userContext";
import { Outlet } from "react-router-dom";

const NavbarLayout = () => {
  const ctx = useContext(UserContext);
  return (
    <div>
      {(ctx.isUserLoggedIn() ||
        sessionStorage.getItem("authenticatedUser")) && <NavBar />}
      <Outlet />
    </div>
  );
};

export default NavbarLayout;
