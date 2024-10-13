import { Routes, Route } from "react-router-dom";
import { useModals } from "./context/ModalContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import Inicio from "./pages/inicio/Inicio";
import Home from "./pages/home/Home";
import LinksUteis from "./pages/LinksUteis/LinksUteis";
import Register1 from "./components/Register1/Register1";
import Register2 from "./components/Register2/Register2";
import { UserProvider } from "./context/UserContext";
import Sobre from "./pages/sobre/Sobre";
import HomeTopbar from "./components/HomeTopbar/HomeTopbar";
import Topbar from "./components/Topbar/Topbar";
import LoginModal from "./components/LoginModal/LoginModal";
import MeusPacientes from "./pages/meuspacientes/MeusPacientes";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css"

function App() {
  const { currentModal, openModal, closeModal, modalData } = useModals();
  const { isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({});

  const handleCloseAllModals = () => {
    closeModal();
  };

  const handleModalClose = (modalToOpen) => {
    closeModal();
    if (modalToOpen) {
      openModal(modalToOpen, formData);
    }
  };

  const handleRegisterClick = () => {
    openModal("register1");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
      {isLoggedIn ? <HomeTopbar /> : <Topbar />}
      <Routes>
        <Route path="/" element={<Inicio openModal={openModal} />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home openModal={openModal} />
          </ProtectedRoute>
        } />
        <Route path="/linksuteis" element={<LinksUteis />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/pacientes" element={
          <ProtectedRoute>
            <MeusPacientes />
          </ProtectedRoute>
        } />
      </Routes>
      <LoginModal
        isOpen={currentModal === "loginModal"}
        onClose={handleCloseAllModals}
        handleRegisterClick={handleRegisterClick}
      />
      {currentModal === "register1" && (
        <Register1
          isOpen={true}
          onClose={handleCloseAllModals}
          onAdvance={() => handleModalClose("register2")}
          formData={modalData}
          setFormData={setFormData}
        />
      )}
      {currentModal === "register2" && (
        <Register2
          isOpen={true}
          onClose={handleCloseAllModals}
          onBack={() => handleModalClose("register1")}
          formData={modalData}
        />
      )}
      
    </UserProvider>
  );
}

export default App;