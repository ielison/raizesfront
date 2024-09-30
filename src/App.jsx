import { Routes, Route } from "react-router-dom";
import { useModals } from "./context/ModalContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react"; // Import useState
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
import "./App.css"

function App() {
  const { currentModal, openModal, closeModal, modalData } = useModals();
  const { isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({}); // Define formData state

  const handleCloseAllModals = () => {
    closeModal();
  };

  const handleModalClose = (modalToOpen) => {
    closeModal();
    if (modalToOpen) {
      openModal(modalToOpen, formData); // Passa formData ao abrir o modal
    }
  };

  const handleRegisterClick = () => {
    openModal("register1");
  };

  return (
    <UserProvider>
      {isLoggedIn ? <HomeTopbar /> : <Topbar />}
      <Routes>
        <Route path="/" element={<Inicio openModal={openModal} />} />
        <Route path="/home" element={<Home openModal={openModal} />} />
        <Route path="/linksuteis" element={<LinksUteis />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/pacientes" element={<MeusPacientes />} />
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
          formData={modalData} // Recebe os dados do modal
          setFormData={setFormData}
        />
      )}
      {currentModal === "register2" && (
        <Register2
          isOpen={true}
          onClose={handleCloseAllModals}
          onBack={() => handleModalClose("register1")}
          formData={modalData} // Recebe os dados do modal
        />
      )}
      
     
      
    </UserProvider>
  );
}

export default App;
