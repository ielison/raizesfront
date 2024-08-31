import { useModals } from "../../context/ModalContext";
import Logo from "../../assets/logo.svg";
import "./HomeTopbar.css";
import Etapa1Modal from "../Etapa1Modal/Etapa1Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function HomeTopbar() {
  const { openModal, closeModal, currentModal } = useModals();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleStartClick = () => {
    openModal("Etapa1Modal");
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleLinksUteisClick = (e) => {
    e.preventDefault();
    navigate("/linksuteis");
    setIsMenuOpen(false); // Close the menu
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleSobreClick = (e) => {
    e.preventDefault();
    navigate("/sobre");
    setIsMenuOpen(false); // Close the menu
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header-home__topbar ${isMenuOpen ? "open" : ""}`}>
      <img
        className="logo"
        src={Logo}
        alt="Logo Raízes"
        onClick={handleLogoClick}
      />
      <button className="header-home__menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </button>
      <nav className={`header-home__nav ${isMenuOpen ? "open" : ""}`}>
        <ul className="links-uteis__hometopbar">
          <li>
            <a
              href=""
              onClick={handleSobreClick}
              style={{
                textDecoration: location.pathname === "/sobre" ? "underline" : "none",
              }}
            >
              Sobre nós
            </a>
          </li>
          <li>
            <a
              href="/linksuteis"
              onClick={handleLinksUteisClick}
              className={location.pathname === "/linksuteis" ? "underline" : ""}
            >
              Links úteis
            </a>
          </li>
          <li>
            <button className="cadastrar-paciente" onClick={handleStartClick}>
              Cadastrar Paciente
            </button>
          </li>
          <li>
            <button className="meus-pacientes">Meus Pacientes</button>
          </li>
          <li>
            <button className="logout" onClick={handleLogout}>Sair</button>
          </li>
        </ul>
      </nav>
      {currentModal === "Etapa1Modal" && (
        <Etapa1Modal onClose={handleCloseModal} />
      )}
    </header>
  );
}
