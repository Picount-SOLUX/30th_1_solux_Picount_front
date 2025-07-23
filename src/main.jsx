import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProfileProvider } from "./context/ProfileProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ProfileProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ProfileProvider>
);
