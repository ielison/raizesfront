import { Routes, Route } from "react-router-dom";
import { useModals } from "./context/ModalContext";
import Etapa1Modal from "./components/Etapa1Modal/Etapa1Modal";
import Etapa2Modal from "./components/Etapa2Modal/Etapa2modal"
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
import RegisterEnd from "./components/RegisterEnd/RegisterEnd";
import { UserProvider } from "./context/UserContext";
import LinksUteis2 from "./pages/LinksUteis2/LinksUteis2";

function App() {
  const { currentModal, openModal, closeModal } = useModals();

  const handleModalClose = (modalToOpen) => {
    closeModal();
    if (modalToOpen) {
      openModal(modalToOpen);
    }
  };

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Inicio openModal={openModal} />} />
        <Route path="/home" element={<Home openModal={openModal} />} />
        <Route path="/links" element={<LinksUteis />} />
        <Route path="/linksuteis" element={<LinksUteis2 />} />
        
      </Routes>

      {currentModal === "register1" && (
        <Register1
          isOpen={true}
          onClose={() => closeModal()}
          onAdvance={() => handleModalClose("register2")}
        />
      )}

      {currentModal === "register2" && (
        <Register2
          isOpen={true}
          onClose={() => closeModal()}
          onBack={() => handleModalClose("register1")}
          onFinish={() => handleModalClose("registerEnd")}
        />
      )}

      {currentModal === "registerEnd" && (
        <RegisterEnd
          isOpen={true}
          onClose={() => closeModal()}
        />
      )}

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
        />
      )}

      {currentModal === "FilhosFilhas" && (
        <FilhosFilhas
          onClose={() => handleModalClose("DadosPaciente")}
          onAdvance={() => handleModalClose("NetosNetas")}
        />
      )}

      {currentModal === "NetosNetas" && (
        <NetosNetas
          onClose={() => handleModalClose("FilhosFilhas")}
          onAdvance={() => handleModalClose("IrmaosIrmas")}
        />
      )}

      {currentModal === "IrmaosIrmas" && (
        <IrmaosIrmas
          onClose={() => handleModalClose("NetosNetas")}
          onAdvance={() => handleModalClose("SobrinhoSobrinha")}
        />
      )}

      {currentModal === "SobrinhoSobrinha" && (
        <SobrinhoSobrinha
          onClose={() => handleModalClose("IrmaosIrmas")}
          onAdvance={() => handleModalClose("Etapa2Modal")}
        />
      )}

      {currentModal === "Etapa2Modal" && (
        <Etapa2Modal
          onClose={() => handleModalClose("SobrinhoSobrinha")}
          onAdvance={() => handleModalClose("DadosFamiliaMaterna")}
        />
      )}

      {currentModal === "DadosFamiliaMaterna" && (
        <DadosFamiliaMaterna
          onClose={() => handleModalClose("Etapa2Modal")}
          onAdvance={() => handleModalClose("AvosMaternos")}
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
