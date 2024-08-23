import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./PrimosPrimasMaternos.css";

export default function PrimosPrimasMaternos({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [primosHadCancer, setPrimosHadCancer] = useState(false);
  const [primosDetails, setPrimosDetails] = useState([
    { relationship: "", type: null, age: "" }
  ]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge(!noKnowledge);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleAddMore = () => {
    setPrimosDetails([
      ...primosDetails,
      { relationship: "", type: null, age: "" }
    ]);
  };

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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa2" />
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="grupo">
        <h2>Etapa 2 - Primos e primas</h2>
        
        <label>
          Algum primo ou prima do seu lado materno já teve câncer?
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={primosHadCancer}
                onChange={() => setPrimosHadCancer(!primosHadCancer)}
              />
              Algum/alguns primos maternos já foram acometidos
            </label>
            <label>
              <input
                type="checkbox"
                value="none"
                checked={!primosHadCancer}
                onChange={() => setPrimosHadCancer(false)}
              />
              Nenhum dos meus primos maternos foram acometidos
            </label>
            <label>
              <input
                type="checkbox"
                value="no-knowledge"
                checked={noKnowledge}
                onChange={handleNoKnowledgeChange}
              />
              Não tenho conhecimento da saúde dos meus primos maternos
            </label>
          </div>
        </label>

        {!noKnowledge && primosHadCancer && (
          <>
            {primosDetails.map((primo, index) => (
              <div key={index}>
                <label>
                  Parentesco:
                  <input
                    type="text"
                    value={primo.relationship}
                    onChange={(e) => {
                      const newDetails = [...primosDetails];
                      newDetails[index].relationship = e.target.value;
                      setPrimosDetails(newDetails);
                    }}
                  />
                </label>
                <label>
                  Tipo de câncer:
                  <Select
                    options={cancerOptions}
                    value={primo.type}
                    onChange={(selectedOption) => {
                      const newDetails = [...primosDetails];
                      newDetails[index].type = selectedOption;
                      setPrimosDetails(newDetails);
                    }}
                  />
                </label>
                <label>
                  Idade:
                  {showAgeDropdown ? (
                    <Select
                      options={ageOptions}
                      value={primo.age}
                      onChange={(selectedOption) => {
                        const newDetails = [...primosDetails];
                        newDetails[index].age = selectedOption;
                        setPrimosDetails(newDetails);
                      }}
                    />
                  ) : (
                    <input
                      type="number"
                      value={primo.age}
                      onChange={(e) => {
                        const newDetails = [...primosDetails];
                        newDetails[index].age = e.target.value;
                        setPrimosDetails(newDetails);
                      }}
                    />
                  )}
                  <button type="button" onClick={handleAgeToggle}>
                    {showAgeDropdown ? "Digitar idade" : "Não sei"}
                  </button>
                </label>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={handleAddMore}>
              +
            </button>
          </>
        )}

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
    </div>
  );
}

PrimosPrimasMaternos.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
