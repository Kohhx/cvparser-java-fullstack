import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserContext, value } from "./context/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserContext.Provider value={value}>
    <App />
  </UserContext.Provider>
);
