import { useModals } from "../../context/ModalContext";
import Logo from "../../assets/logo.svg";
import "./HomeTopbar.css";
import Etapa1Modal from "../Etapa1Modal/Etapa1Modal";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { openModal, closeModal, currentModal } = useModals();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/");
  };

  const handleStartClick = () => {
    openModal("Etapa1Modal");
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleLinksUteisClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    navigate("/linksuteis"); // Navigate to /linksuteis when the link is clicked
  };

  const handleLogoClick = () => {
    navigate("/home"); // Navigate to /home when the logo is clicked
  };

  const handleSobreClick = (e) => {
    e.preventDefault();
    
    navigate("/sobre");
  };

  return (
    <header className="header-home__topbar">
      <img
        className="logo"
        src={Logo}
        alt="Logo Raízes"
        onClick={handleLogoClick}
      />
      <nav>
        <ul className="links-uteis__hometopbar">
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
              href="/linksuteis" // Set href for proper semantic navigation
              onClick={handleLinksUteisClick}
              className={location.pathname === "/linksuteis" ? "underline" : ""}
            >
              Links úteis
            </a>
          </li>
        </ul>
      </nav>
      <div className="hometopbar-buttons">
        <button className="cadastrar-paciente" onClick={handleStartClick}>
          Cadastrar Paciente
        </button>
        <button className="meus-pacientes">Meus Pacientes</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {currentModal === "Etapa1Modal" && (
        <Etapa1Modal onClose={handleCloseModal} />
      )}
    </header>
  );
}
