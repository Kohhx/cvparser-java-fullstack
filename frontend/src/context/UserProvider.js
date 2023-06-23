import React, { useState, useCallback } from "react";
import { UserContext } from "../context/userContext";

const UserProvider = ({ children }) => {
  const initalState = {
    isLoggedIn: false,
    role: "",
    id: "",
    userAuth: "",
  }
  const [userDetails, setUserDetails] = useState(initalState);

  function handleUserLogin() {
    if (
      sessionStorage.getItem("token") &&
      sessionStorage.getItem("authenticatedUser")
    ) {
      setUserDetails((prev) => ({ ...prev, isLoggedIn: true }));
    }
  }

  function handleUserRole() {
    setUserDetails((prev) => ({
      ...prev,
      role: sessionStorage.getItem("role"),
    }));
  }

  function handleUserId() {
    setUserDetails( prev => ({ ...prev, id: sessionStorage.getItem("id") }));
  }

  function handleUserEmail() {
    setUserDetails( prev => ({
      ...prev,
      userAuth: sessionStorage.getItem("authenticatedUser"),
    }));
  }

  function loginUserDetails() {
    handleUserLogin()
    handleUserRole();
    handleUserId();
    handleUserEmail();
  }


  function logoutUserDetails() {
    setUserDetails(initalState);
  }

  function isUserLoggedIn() {
    return  (sessionStorage.getItem("token") &&
    sessionStorage.getItem("authenticatedUser")) || false;
  }

  function getUserRole() {
    return sessionStorage.getItem("role");
  }


  return (
    <UserContext.Provider
      value={{
        userDetails,
        handleUserLogin,
        handleUserRole,
        handleUserId,
        loginUserDetails,
        logoutUserDetails,
        isUserLoggedIn,
        getUserRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
