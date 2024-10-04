import PropTypes from "prop-types";
import "./QuestionarioFinalizado.css";

export default function QuestionarioFinalizado() {
  
  return (
    <div>
      <div className="modal-content-questionario__finalizado" onClick={(e) => e.stopPropagation()}>
        <p>Com base nas respostas obtidas pudemos gerar um relatório.</p>        
      </div>
    </div>
  );
}

QuestionarioFinalizado.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
