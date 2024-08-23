import PropTypes from "prop-types";
import "./QuestionarioFinalizado2.css";

export default function QuestionarioFinalizado2({ onClose, onOpenReport, onDownloadReport }) {
  const handleOpenReportClick = () => {
    console.log("Open detailed report button clicked");
    onOpenReport();
  };

  const handleDownloadReportClick = () => {
    console.log("Download detailed report button clicked");
    onDownloadReport();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-questionario__finalizado2" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="alert-icon">⚠️</div>
        <h2>Atenção, pode haver risco!</h2>
        <p>
          Seu paciente atende aos critérios que indicam um alto risco para câncer hereditário.
          Recomendamos encaminhá-lo a um serviço especializado. Consulte a aba Links Úteis para
          obter mais informações sobre profissionais e serviços especializados.
        </p>
        <p>
          É importante destacar que muitos casos de câncer estão relacionados ao estilo de vida e a
          fatores ambientais. Recomendamos enfatizar a importância de hábitos saudáveis, como dieta
          equilibrada, exercícios físicos regulares, abstenção de tabagismo e consumo moderado de
          álcool, para ajudar a reduzir o risco de desenvolver câncer.
        </p>
        <p>
          Além disso, é fundamental estar atento a outros fatores de risco, como exposição a agentes
          carcinogênicos no ambiente de trabalho, histórico pessoal de doenças prévias, idade e
          outros aspectos relevantes à saúde do paciente.
        </p>
        <p>
          Continue monitorando e incentivando hábitos de vida saudáveis em seus pacientes, pois isso
          desempenha um papel significativo na prevenção do câncer e na promoção da saúde.
        </p>
        <div className="form-buttons">
          <button className="btn-open-report" onClick={handleOpenReportClick}>
            Abrir relatório detalhado
          </button>
          <button className="btn-download-report" onClick={handleDownloadReportClick}>
            Baixar relatório detalhado
          </button>
        </div>
      </div>
    </div>
  );
}

QuestionarioFinalizado2.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenReport: PropTypes.func.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
};
