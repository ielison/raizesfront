import PropTypes from "prop-types";
import "./QuestionarioFinalizado.css";

export default function QuestionarioFinalizado({ onClose, onAdvance }) {
  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-questionario__finalizado" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Questionário finalizado!</h2>
        <p>Com base nas respostas obtidas pudemos gerar um relatório.</p>
        <div className="form-buttons">
          <button className="btn-next" onClick={handleAdvanceClick}>
            Abrir relatório
          </button>
        </div>
      </div>
    </div>
  );
}

QuestionarioFinalizado.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
