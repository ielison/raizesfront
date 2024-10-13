import "./HomeHero.css";
import { useModals } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext"; // Importando AuthContext

export default function HomeHero() {
  const { nome,} = useAuth(); // Obtendo nome e idUser do AuthContext
  const { openModal,  } = useModals();

  const handleStartClick = () => {
    openModal("PacienteModal");
  };

 
  return (
    <div className="homeHero__container">
      <div className="homeHero__content">
        <h1 className="homeHero__title">Olá, {nome || "usuário"}!</h1>
        <p className="homeHero__paragraph">
          Raízes é uma plataforma dedicada à identificação de indivíduos e
          famílias em situação de alto risco para câncer hereditário. Essa
          plataforma auxilia você a:
        </p>
        <ul className="homeHero__list">
          <li className="homeHero__list-item">
            Coletar e registrar a história pessoal e familiar de câncer de seu
            paciente por meio de perguntas direcionadas.
          </li>
          <li className="homeHero__list-item">
            Facilitar o encaminhamento de indivíduos de alto risco a serviços
            especializados.
          </li>
        </ul>
        <button className="homeHero__startButton" onClick={handleStartClick}>
          Começar avaliação
        </button>
      </div>
     {/*  {currentModal === "PacienteModal" && (
        <PacienteModal onClose={handleCloseModal} idUser={idUser} />
      )} */}
    </div>
  );
}
