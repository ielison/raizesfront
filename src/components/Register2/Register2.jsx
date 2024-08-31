import PropTypes from "prop-types";
import "./Register2.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Register2 = ({ isOpen, onClose, onBack, formData }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { login } = useAuth();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(false);
  const [subscribeUpdates, setSubscribeUpdates] = useState(false);

  const handleFinish = () => {
    if (!acceptedTerms) {
      alert("Você deve aceitar os termos para continuar.");
      return;
    }
    setUser({ nome: formData.nome });
    login();
    navigate("/home");
  };

  const handleBack = () => {
    onBack(); // Volta para Register1
  };

  if (!isOpen) return null;

  return (
    <div className="register2-modal-overlay" onClick={onClose}>
      <div
        className="register2-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="register2-header">
          <h2>Dados de Cadastro</h2>
          <button className="register2-close-button" onClick={onClose}>
            X
          </button>
        </div>
        <p>Por favor, confirme as informações</p>
        <div className="stepper-wrapper">
          <div className="stepper-item completed">
            <div className="step-counter">1</div>
            <div className="step-name">Informações Básicas</div>
          </div>
          <div className="stepper-item active">
            <div className="step-counter">2</div>
            <div className="step-name">Segunda Etapa</div>
          </div>
        </div>
        <div className="register2-confirmation-table">
          <div>
            <strong>Primeiro Nome:</strong> {formData.nome}
          </div>
          <div>
            <strong>Sobrenome:</strong> {formData.sobrenome}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>Título:</strong> {formData.titulo}
          </div>
          <div>
            <strong>Graduação:</strong> {formData.graduacao}
          </div>
          <div>
            <strong>Instituição:</strong> {formData.instituicao}
          </div>
          <div>
            <strong>Profissional de Saúde:</strong>{" "}
            {formData.profissionalSaude ? "Sim" : "Não"}
          </div>
          <div>
            <strong>País:</strong> {formData.pais}
          </div>
          <div>
            <strong>Estado:</strong> {formData.estado}
          </div>
          <div>
            <strong>CEP:</strong> {formData.cep}
          </div>
          <div>
            <strong>Rua:</strong> {formData.endereco}
          </div>
          <div>
            <strong>Cidade:</strong> {formData.cidade}
          </div>
          <div>
            <strong>Tel. Primário:</strong> {formData.telefonePrimario}
          </div>
          <div>
            <strong>Celular:</strong> {formData.celular}
          </div>
        </div>
        <div className="register2-terms-section">
          <h3>Leia e aceite os termos de usuário</h3>
          <div className="register2-terms-box">
            <p>
              Ao utilizar a plataforma raízes, você, o usuário, concorda com os
              seguintes termos e condições:
              <br />
              Uso Autorizado: Você se compromete a usar esta plataforma apenas
              para fins legais e de acordo com as políticas estabelecidas.
              <br />
              Privacidade: Seu uso a plataforma está sujeito à nossa Política de
              Privacidade, que explica como coletamos e usamos suas informações
              pessoais.
              <br />
              Propriedade Intelectual: O conteúdo da plataforma são protegidos
              por leis de direitos autorais e não podem ser copiados sem
              permissão expressa.
              <br />
              Limitações de Responsabilidade: Não nos responsabilizamos por
              danos diretos, indiretos, incidentais ou consequentes resultantes
              do uso, ou da incapacidade de usar a ferramenta.
              <br />
              Modificações: Reservamo-nos o direito de alterar estes termos a
              qualquer momento. As alterações entram em vigor imediatamente após
              a publicação.
              <br />
              Ao clicar em &quot;Aceitar&quot; ou ao continuar a utilizar a
              ferramenta, você reconhece que leu, entendeu e concordou em estar
              vinculado a estes termos.
            </p>
          </div>
          <div>
            <input
              type="checkbox"
              id="accept-terms"
              required
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms((prev) => !prev)}
            />
            <label htmlFor="accept-terms">
              Aceito os termos de usuário conforme apresentado
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="subscribe-news"
              checked={subscribeNews}
              onChange={() => setSubscribeNews((prev) => !prev)}
            />
            <label htmlFor="subscribe-news">
              Gostaria de receber e-mails do Raízes, como resultados e notícias
              da ferramenta.
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="subscribe-updates"
              checked={subscribeUpdates}
              onChange={() => setSubscribeUpdates((prev) => !prev)}
            />
            <label htmlFor="subscribe-updates">
              Em caso de atualizações sobre o cálculo de risco, gostaria de ser
              notificado sobre mudança.
            </label>
          </div>
        </div>
        <div className="register2-buttons-section">
          <button onClick={handleBack} className="register2-back-button">
            Voltar
          </button>
          <button
            onClick={handleFinish}
            className="register2-finish-button"
            disabled={!acceptedTerms}
          >
            Finalizar Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

Register2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

export default Register2;