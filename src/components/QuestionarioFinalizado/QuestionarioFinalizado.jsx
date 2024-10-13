import PropTypes from "prop-types";
import "./QuestionarioFinalizado.css";

export default function QuestionarioFinalizado({ onAdvance }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content-questionario__finalizado" onClick={(e) => e.stopPropagation()}>
        <h2>Questionário Finalizado</h2>
        <p>Com base nas respostas obtidas pudemos gerar um relatório.</p>
        <div className="button-container">
          <button className="btn-advance" onClick={onAdvance}>Avançar</button>
        </div>
      </div>
    </div>
  );
}

QuestionarioFinalizado.propTypes = {
  onAdvance: PropTypes.func.isRequired,
};