import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ScrollToTop from "./components/ScrollTop";
import { HashRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <HashRouter>
    <React.StrictMode>
      <ScrollToTop />
      <App />
    </React.StrictMode>
  </HashRouter>,
);
