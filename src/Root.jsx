import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import ReactGA from "react-ga4";

// Create a custom hook to track page views
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
}

function RootContent() {
  usePageTracking();

  return (
    <ModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ModalProvider>
  );
}

function Root() {
  return (
    <Router>
      <RootContent />
    </Router>
  );
}

export default Root;