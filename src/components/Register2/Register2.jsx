import PropTypes from "prop-types";
import "./Register2.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterEnd from "../RegisterEnd/RegisterEnd";
import { useUser } from "../../context/UserContext";

export default function Register2({ isOpen, onClose, onBack, formData }) {
  const [showRegisterEnd, setShowRegisterEnd] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleFinish = () => {
    setUser({ nome: formData.nome });
    setShowRegisterEnd(true);
  };

  const handleRegisterEndClose = () => {
    setShowRegisterEnd(false);
    navigate("/home");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="r2modal-overlay" onClick={onClose}>
        <div className="r2modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="register-header">
            <h2>Dados de Cadastro</h2>
            <button className="close-button" onClick={onClose}>
              X
            </button>
          </div>
          <p>Por favor, confirme as informações</p>
          <div className="stepper">
            <div className="step active">Informações Básicas</div>
            <div className="step active">
              <span className="dotted-line"></span>
              Finalização
            </div>
          </div>
          <div className="confirmation-table">
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
          <div className="terms-section">
            <h3>Leia e aceite os termos de usuário</h3>
            <div className="terms-box">
              <p>
                Ao utilizar a ferramenta eletrônica [Nome da Ferramenta], você, o
                usuário, concorda com os seguintes termos e condições:
                {/* Add more text here as needed */}
              </p>
            </div>
            <div>
              <input type="checkbox" required />
              <label>Aceito os termos de usuário conforme apresentado</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>
                Gostaria de receber e-mails do Raízes, como resultados e notícias
                da ferramenta.
              </label>
            </div>
            <div>
              <input type="checkbox" />
              <label>
                Em caso de atualizações sobre o cálculo de risco, gostaria de ser
                notificado sobre mudança.
              </label>
            </div>
          </div>
          <div className="buttons-section">
            <button onClick={onBack} className="back-button">
              Voltar
            </button>
            <button onClick={handleFinish} className="finish-button">
              Finalizar Cadastro
            </button>
          </div>
        </div>
      </div>

      {showRegisterEnd && (
        <RegisterEnd isOpen={showRegisterEnd} onClose={handleRegisterEndClose} />
      )}
    </>
  );
}

Register2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};
