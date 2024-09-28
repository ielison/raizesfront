import { Routes, Route } from "react-router-dom";
import { useModals } from "./context/ModalContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react"; // Import useState
import Etapa1Modal from "./components/Etapa1Modal/Etapa1Modal";
import Etapa2Modal from "./components/Etapa2Modal/Etapa2modal";
import DadosPaciente from "./components/DadosPaciente/DadosPaciente";
import FilhosFilhas from "./components/FilhosFilhas/FilhosFilhas";
import NetosNetas from "./components/NetosNetas/NetosNetas";
import IrmaosIrmas from "./components/IrmaosIrmas/IrmaosIrmas";
import SobrinhoSobrinha from "./components/SobrinhoSobrinha/SobrinhoSobrinha";
import Inicio from "./pages/inicio/Inicio";
import Home from "./pages/home/Home";
import LinksUteis from "./pages/LinksUteis/LinksUteis";
import DadosFamiliaMaterna from "./components/DadosFamiliaMaterna/DadosFamiliaMaterna";
import AvosMaternos from "./components/AvosMaternos/AvosMaternos";
import PrimosPrimasMaternos from "./components/PrimosPrimasMaternas/PrimosPrimasMaternos";
import FamiliaresDistantesMaterno from "./components/FamiliaresDistantesMaterno/FamiliaresDistantesMaterno";
import Etapa3Modal from "./components/Etapa3Modal/Etapa3Modal";
import DadosFamiliaPaterna from "./components/DadosFamiliaPaterna/DadosFamiliaPaterna";
import AvosPaternos from "./components/AvosPaternos/AvosPaternos";
import PrimosPrimasPaternos from "./components/PrimosPrimasPaternas/PrimosPrimasPaternos";
import FamiliaresDistantesPaterno from "./components/FamiliaresDistantesPaterno/FamiliaresDistantesPaterno";
import QuestionarioFinalizado from "./components/QuestionarioFinalizado/QuestionarioFinalizado";
import QuestionarioFinalizado2 from "./components/QuestionarioFinalizado2/QuestionarioFinalizado2";
import Register1 from "./components/Register1/Register1";
import Register2 from "./components/Register2/Register2";
// import RegisterEnd from "./components/RegisterEnd/RegisterEnd";
import { UserProvider } from "./context/UserContext";
import Sobre from "./pages/sobre/Sobre";
import HomeTopbar from "./components/HomeTopbar/HomeTopbar";
import Topbar from "./components/Topbar/Topbar";
import LoginModal from "./components/LoginModal/LoginModal";
import MeusPacientes from "./pages/meuspacientes/MeusPacientes";

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
          onClose={handleCloseAllModals} // Garante que todos os modais sejam fechados
          //onBack={() => handleModalClose("register1")} // Se você ainda quiser voltar para o modal anterior
          formData={modalData} // Recebe os dados do modal
        />
      )}
      {/* {currentModal === "registerEnd" && (
        <RegisterEnd isOpen={true} onClose={() => closeModal()} />
      )} */}
      {currentModal === "Etapa1Modal" && (
        <Etapa1Modal
          onClose={closeModal}
          onStartEvaluation={() => handleModalClose("DadosPaciente")}
        />
      )}
      {currentModal === "DadosPaciente" && (
        <DadosPaciente
          onClose={() => handleModalClose("Etapa1Modal")}
          onAdvance={() => handleModalClose("FilhosFilhas")}
          onBack={() => handleModalClose("Etapa1Modal")}
        />
      )}
      {currentModal === "FilhosFilhas" && (
        <FilhosFilhas
          onClose={() => handleModalClose("DadosPaciente")}
          onAdvance={() => handleModalClose("NetosNetas")}
          onBack={() => handleModalClose("DadosPaciente")}
        />
      )}
      {currentModal === "NetosNetas" && (
        <NetosNetas
          onClose={() => handleModalClose("FilhosFilhas")}
          onAdvance={() => handleModalClose("IrmaosIrmas")}
          onBack={() => handleModalClose("FilhosFilhas")}
        />
      )}
      {currentModal === "IrmaosIrmas" && (
        <IrmaosIrmas
          onClose={() => handleModalClose("NetosNetas")}
          onAdvance={() => handleModalClose("SobrinhoSobrinha")}
          onBack={() => handleModalClose("NetosNetas")}
        />
      )}
      {currentModal === "SobrinhoSobrinha" && (
        <SobrinhoSobrinha
          onClose={() => handleModalClose("IrmaosIrmas")}
          onAdvance={() => handleModalClose("Etapa2Modal")}
          onBack={() => handleModalClose("IrmaosIrmas")}
        />
      )}
      {currentModal === "Etapa2Modal" && (
        <Etapa2Modal
          onClose={() => handleModalClose("SobrinhoSobrinha")}
          onAdvance={() => handleModalClose("DadosFamiliaMaterna")}
          onBack={() => handleModalClose("SobrinhoSobrinha")}
        />
      )}
      {currentModal === "DadosFamiliaMaterna" && (
        <DadosFamiliaMaterna
          onClose={() => handleModalClose("Etapa2Modal")}
          onAdvance={() => handleModalClose("AvosMaternos")}
          onBack={() => handleModalClose("Etapa2Modal")}
        />
      )}
      {currentModal === "AvosMaternos" && (
        <AvosMaternos
          onClose={() => handleModalClose("DadosFamiliaMaterna")}
          onAdvance={() => handleModalClose("PrimosPrimasMaternos")}
          onBack={() => handleModalClose("DadosFamiliaMaterna")}
        />
      )}
      {currentModal === "PrimosPrimasMaternos" && (
        <PrimosPrimasMaternos
          onClose={() => handleModalClose("AvosMaternos")}
          onBack={() => handleModalClose("AvosMaternos")}
          onAdvance={() => handleModalClose("FamiliaresDistantesMaterno")}
        />
      )}
      {currentModal === "FamiliaresDistantesMaterno" && (
        <FamiliaresDistantesMaterno
          onClose={() => handleModalClose("PrimosPrimasMaternos")}
          onBack={() => handleModalClose("PrimosPrimasMaternos")}
          onAdvance={() => handleModalClose("Etapa3Modal")}
        />
      )}
      {currentModal === "Etapa3Modal" && (
        <Etapa3Modal
          onClose={() => handleModalClose("FamiliaresDistantesMaterno")}
          onBack={() => handleModalClose("FamiliaresDistantesMaterno")}
          onAdvance={() => handleModalClose("DadosFamiliaPaterna")}
        />
      )}
      {currentModal === "DadosFamiliaPaterna" && (
        <DadosFamiliaPaterna
          onClose={() => handleModalClose("Etapa3Modal")}
          onBack={() => handleModalClose("Etapa3Modal")}
          onAdvance={() => handleModalClose("AvosPaternos")}
        />
      )}
      {currentModal === "AvosPaternos" && (
        <AvosPaternos
          onClose={() => handleModalClose("DadosFamiliaPaterna")}
          onBack={() => handleModalClose("DadosFamiliaPaterna")}
          onAdvance={() => handleModalClose("PrimosPrimasPaternos")}
        />
      )}
      {currentModal === "PrimosPrimasPaternos" && (
        <PrimosPrimasPaternos
          onClose={() => handleModalClose("AvosPaternos")}
          onBack={() => handleModalClose("AvosPaternos")}
          onAdvance={() => handleModalClose("FamiliaresDistantesPaterno")}
        />
      )}
      {currentModal === "FamiliaresDistantesPaterno" && (
        <FamiliaresDistantesPaterno
          onClose={() => handleModalClose("PrimosPrimasPaternos")}
          onBack={() => handleModalClose("PrimosPrimasPaternos")}
          onAdvance={() => handleModalClose("QuestionarioFinalizado")}
        />
      )}
      {currentModal === "QuestionarioFinalizado" && (
        <QuestionarioFinalizado
          onClose={() => handleModalClose("FamiliaresDistantesPaterno")}
          onAdvance={() => handleModalClose("QuestionarioFinalizado2")}
        />
      )}
      {currentModal === "QuestionarioFinalizado2" && (
        <QuestionarioFinalizado2
          onClose={() => handleModalClose("QuestionarioFinalizado")}
        />
      )}
    </UserProvider>
  );
}

export default App;
