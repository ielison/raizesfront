import PropTypes from "prop-types";
import "./Etapa2Modal.css";

export default function Etapa2Modal({ onClose, onBack, onAdvance }) {
  const handleBackClick = () => {
    console.log("Back button clicked");
    onBack();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  return (
    <div className="etapa2-modal-overlay" onClick={onClose}>
      <div className="modal-content-etapa2" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Etapa 2 - Análise da Família Materna</h2>
        <p>Nesta fase iremos analisar sua família materna.</p>
        <div className="em2-form-buttons">
          <button className="btn-back-em2" onClick={handleBackClick}>
            Voltar
          </button>
          <button className="btn-next-em2" onClick={handleAdvanceClick}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}

Etapa2Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
