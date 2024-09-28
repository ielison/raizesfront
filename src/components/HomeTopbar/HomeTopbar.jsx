import { useModals } from "../../context/ModalContext";
import Logo from "../../assets/logo.svg";
import "./HomeTopbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import PacienteModal from "../PacienteModal/PacienteModal";


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
    openModal("PacienteModal");
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

  const handleMeusPacientesClick = () => {
    navigate("/pacientes");
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
                textDecoration:
                  location.pathname === "/sobre" ? "underline" : "none",
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
            <button
              className={`pacientes-btn ${
                location.pathname === "/pacientes" ? "active" : ""
              }`}
              onClick={handleMeusPacientesClick}
            >
              Meus Pacientes
            </button>
          </li>
          <li>
            <button className="logout" onClick={handleLogout}>
              Sair
            </button>
          </li>
        </ul>
      </nav>
      {currentModal === "PacienteModal" && (
        <PacienteModal onClose={handleCloseModal} />
      )}
    </header>
  );
}
