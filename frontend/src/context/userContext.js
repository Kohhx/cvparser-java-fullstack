import { createContext } from "react";

export const UserContext = createContext();

function isUserloggedIn() {
  return localStorage.getItem("token") &&  localStorage.getItem('authenticatedUser') ? true : false;
}

function getUserRole() {
  console.log(localStorage.getItem("role"));
  return localStorage.getItem("role");
}

export const value = { isUserloggedIn, getUserRole };
