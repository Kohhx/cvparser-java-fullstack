import { createContext } from "react";

export const UserContext = createContext();

function isUserLoggedIn() {
  return sessionStorage.getItem("token") && sessionStorage.getItem('authenticatedUser') ? true : false;
}

function getUserRole() {
  console.log(sessionStorage.getItem("role"));
  return sessionStorage.getItem("role");
}

function getUserId() {
  console.log(sessionStorage.getItem("id"));
  return sessionStorage.getItem("id");
}

export const value = { isUserLoggedIn, getUserRole, getUserId };
