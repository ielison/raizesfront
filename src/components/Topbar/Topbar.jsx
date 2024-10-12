import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/LOGO 1.png";
import LoginModal from "../LoginModal/LoginModal";
import Register1 from "../Register1/Register1";
import "./Topbar.css";

export default function Topbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para o menu
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    handleCloseLoginModal();
    setIsRegisterModalOpen(true);
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
    navigate("/sobre");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="topbar__header">
      <img
        className="topbar__logo"
        src={Logo}
        alt="Logo Raízes"
        onClick={handleLogoClick}
      />
      <nav className={`topbar__nav ${isMenuOpen ? "open" : ""}`}>
        <ul>
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
              href=""
              onClick={handleLinksUteisClick}
              style={{
                textDecoration:
                  location.pathname === "/linksuteis" ? "underline" : "none",
              }}
            >
              Links úteis
            </a>
          </li>
        </ul>
        {/* Botões dentro do menu na versão mobile */}
        <div className="botoes_topbar">
          <button className="topbar__register" onClick={handleRegisterClick}>
            Registrar
          </button>
          <button className="topbar__login" onClick={handleLoginClick}>
            Entrar
          </button>
        </div>
      </nav>
      <div className="topbar__div">
        <button className="topbar__register" onClick={handleRegisterClick}>
          Registrar
        </button>
        <button className="topbar__login" onClick={handleLoginClick}>
          Entrar
        </button>
      </div>
      <button
        className="topbar__menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? "✕" : "☰"} {/* Alterna entre X e ☰ */}
      </button>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        handleRegisterClick={handleRegisterClick}
      />
      <Register1
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onAdvance={() => {}}
      />
    </header>
  );
}
