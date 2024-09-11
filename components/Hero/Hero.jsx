import "./Hero.css";
import Instagram from "../../assets/instagram.svg";

export default function Hero() {
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
            Facilitar o encaminhamento de indivíduos de alto risco a serviços
            especializados.
          </li>
          <li className="hero-list-item">
            Coletar e registrar a história pessoal e familiar de câncer de seu
            paciente por meio de perguntas direcionadas.
          </li>
        </ul>
        <button className="hero-startButton">Começar avaliação</button>
      </div>
      <div>
      <img className="instagram" src={Instagram} alt="instagram raízes" />
      </div>
    </div>
  );
}
