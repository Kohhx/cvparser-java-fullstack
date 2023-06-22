import { createContext } from "react";

export const UserContext = createContext();

function isUserloggedIn() {
  return sessionStorage.getItem("token") &&  localStorage.getItem('authenticatedUser') ? true : false;
}

function getUserRole() {
  console.log(sessionStorage.getItem("role"));
  return sessionStorage.getItem("role");
}

function getUserId() {
  console.log(sessionStorage.getItem("id"));
  return sessionStorage.getItem("id");
}

export const value = { isUserloggedIn, getUserRole, getUserId };
