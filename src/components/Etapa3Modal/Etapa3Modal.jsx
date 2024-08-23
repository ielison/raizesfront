import PropTypes from "prop-types";
import "./Etapa3Modal.css";

export default function Etapa3Modal({ onClose, onBack, onAdvance }) {
  const handleBackClick = () => {
    console.log("Back button clicked");
    onBack();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-etapa3" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Etapa3 - Análise da Família Paterna</h2>
        <p>Nesta fase iremos analisar sua família paterna.</p>
        <div className="form-buttons">
          <button className="btn-back" onClick={handleBackClick}>
            Voltar
          </button>
          <button className="btn-next" onClick={handleAdvanceClick}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}

Etapa3Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
