import { useState } from "react";
import "./Hero.css";
import Instagram from "../../assets/instagram.svg";
import LoginModal from "../LoginModal/LoginModal"; // Importando o LoginModal
import Register1 from "../Register1/Register1";

export default function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para controlar o modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true); // Abre o modal
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false); // Fecha o modal
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };


  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Seja bem-vindo!</h1>
        <p className="hero-paragraph">
          Raízes é uma plataforma dedicada à identificação de indivíduos e
          famílias em situação de alto risco para câncer hereditário. Essa
          plataforma auxilia você a:
        </p>
        <ul className="hero-list">
          <li className="hero-list-item">
            Coletar e registrar a história pessoal e familiar de câncer de seu
            paciente por meio de perguntas direcionadas.
          </li>
          <li className="hero-list-item">
            Facilitar o encaminhamento de indivíduos de alto risco a serviços
            especializados.
          </li>
        </ul>
        <button className="hero-startButton" onClick={handleLoginClick}>
          Começar avaliação
        </button>
      </div>
      <div>
        <img className="instagram" src={Instagram} alt="instagram raízes" />
      </div>

     
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal} // Passando a função para fechar o modal
      />
      <Register1
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onAdvance={() => {}}
      />
    </div>
  );
}
