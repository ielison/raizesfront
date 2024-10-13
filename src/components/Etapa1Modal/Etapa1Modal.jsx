import "./Etapa1Modal.css";

export default function Etapa1Modal() {
  

  return (
    
      <div className="etapa1-modal-content" >
        <h2>Olá, leia com atenção!</h2>
        <p>
          O questionário a seguir oferece sugestões de perguntas direcionadas, auxiliando na coleta e registro da história pessoal e familiar de câncer do seu paciente. E em certas questões, você encontrará o símbolo “<span className="info-symbol">&#9432;</span>”, com dicas e informações adicionais para aprimorar ainda mais sua abordagem.
        </p>
        <button className="etapa1-start-button" >
          Iniciar avaliação
        </button>
      </div>
  );
}

