import PropTypes from 'prop-types';
import { useState } from "react";
import "./DadosPaciente.css";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import Sidebar from "../Sidebar/Sidebar";

export default function DadosPaciente({ onClose, onAdvance }) {
  const [diagnoses, setDiagnoses] = useState([{ type: [], age: "" }]);
  const [hasCancer, setHasCancer] = useState(false);
  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(false);

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleBackClick = () => {
    onClose(); // Fecha todos os modais
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked"); // Log when the advance button is clicked
    onAdvance(); // Navega para o próximo modal
  };

  const handleOtherDiagnosisChange = (e) => {
    setHasOtherDiagnosis(e.target.checked); // Atualiza o estado para checkboxes
  };

  return (
    <div className="dp-modal-overlay" onClick={onClose}>
      <div className="dp-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa1" />
        <div className="dp-form-container">
          <button className="dp-close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 1 - Dados do Paciente</h2>
          
          <label>
            Qual o nome do paciente?
            <input type="text" />
          </label>
          
          <div className="dp-row"> {/* Flex container for side by side */}
            <label style={{ flex: 1, marginRight: '10px' }}>
              Sexo biológico
              <select defaultValue="">
                <option value="" disabled>Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>
              Idade do Paciente
              <input type="number" />
            </label>
          </div>
          
          <label>
            O Sr(a) já teve câncer?
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="hasCancer" 
                  value="sim" 
                  checked={hasCancer}
                  onChange={() => setHasCancer(!hasCancer)} 
                />
                Sim
              </label>
              <label>
                <input 
                  type="checkbox" 
                  name="hasCancer" 
                  value="nao" 
                  checked={!hasCancer}
                  onChange={() => setHasCancer(false)} 
                />
                Não
              </label>
            </div>
          </label>
  
          {hasCancer && (
            <>
              <div className="dp-row">
                <label style={{ flex: 1, marginRight: '10px' }}>
                  Qual tipo de câncer o Sr(a) teve?
                  <Select isMulti options={cancerOptions} />
                </label>
                <label style={{ flex: 1 }}>
                  Com que idade o Sr(a) recebeu o diagnóstico?
                  <input type="number" />
                </label>
              </div>
  
              <label>
                O Sr(a) recebeu algum outro diagnóstico de câncer?
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="hasOtherDiagnosis" 
                      value="sim" 
                      checked={hasOtherDiagnosis}
                      onChange={handleOtherDiagnosisChange} 
                    />
                    Sim
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      name="hasOtherDiagnosis" 
                      value="nao" 
                      checked={!hasOtherDiagnosis}
                      onChange={handleOtherDiagnosisChange} 
                    />
                    Não
                  </label>
                </div>
              </label>
              {hasOtherDiagnosis && (
                <>
                  {diagnoses.map((_, index) => (
                    <div key={index}>
                      <div className="dp-row">
                        <label style={{ flex: 1, marginRight: '10px' }}>
                          Tipo de câncer
                          <Select 
                            isMulti 
                            options={cancerOptions} 
                            value={diagnoses[index].type}
                            onChange={(selectedOptions) => {
                              const newDiagnoses = [...diagnoses];
                              newDiagnoses[index].type = selectedOptions;
                              setDiagnoses(newDiagnoses);
                            }}
                          />
                        </label>
                        <label style={{ flex: 1 }}>
                          Idade
                          <input 
                            type="number" 
                            value={diagnoses[index].age}
                            onChange={(e) => {
                              const newDiagnoses = [...diagnoses];
                              newDiagnoses[index].age = e.target.value;
                              setDiagnoses(newDiagnoses);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  <button className="dp-btn-add" onClick={handleAddDiagnosis}>+</button>
                </>
              )}
            </>
          )}
  
          <div className="dp-form-buttons">
            <button className="dp-btn-back" onClick={handleBackClick}>Voltar</button>
            <button className="dp-btn-next" onClick={handleAdvanceClick}>Avançar</button>
          </div>
        </div>
      </div>
    </div>
  );
}  

DadosPaciente.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
