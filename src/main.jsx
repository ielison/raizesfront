import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext"; // Adjust path as needed
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ModalProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ModalProvider>
    </Router>
  </StrictMode>
);
