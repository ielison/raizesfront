import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importando useLocation
import Logo from "../../assets/logo.svg";
import LoginModal from "../LoginModal/LoginModal";
import "./Topbar.css";
import Register1 from "../Register1/Register1";

export default function Topbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Obtendo a localização atual

  const handleLoginClick = () => {
    setIsLoginModalOpen(true); // Use o nome correto da função de estado
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    handleCloseLoginModal(); // Fecha o modal de login ao abrir o de registro
    setIsRegisterModalOpen(true);
    console.log("Abrindo modal de registro...");
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLinksUteisClick = (e) => {
    e.preventDefault();
    navigate("/linksuteis");
  };

  const handleSobreClick = (e) => {
    e.preventDefault();
    console.log("valeu");

    navigate("/sobre");
  };

  const handleLogoClick = () => {
    console.log("Logo clicked");
    navigate("/"); // Navega para a raiz quando o logo é clicado
  };

  return (
    <header className="topbar__header">
      <img
        className="topbar__logo"
        src={Logo}
        alt="Logo Raízes"
        onClick={handleLogoClick}
      />
      <nav className="topbar__nav">
        <ul>
          <li>
            <a
              href=""
              onClick={handleSobreClick}
              style={{
                textDecoration:
                  location.pathname === "/sobre" ? "underline" : "none", // Aplica o sublinhado condicionalmente
              }}
            >
              Sobre nós
            </a>
          </li>
          <li>
            <a
              href=""
              onClick={handleLinksUteisClick}
              style={{
                textDecoration:
                  location.pathname === "/linksuteis" ? "underline" : "none", // Aplica o sublinhado condicionalmente
              }}
            >
              Links úteis
            </a>
          </li>
        </ul>
      </nav>
      <div className="topbar__div">
        <button className="topbar__register" onClick={handleRegisterClick}>
          Registrar
        </button>
        <button className="topbar__login" onClick={handleLoginClick}>
          Entrar
        </button>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        handleRegisterClick={handleRegisterClick} // Certifique-se de passar a função aqui
      />
      <Register1
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onAdvance={() => {}}
      />
    </header>
  );
}
