import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./PrimosPrimasMaternos.css";

export default function PrimosPrimasMaternos({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [primosHadCancer, setPrimosHadCancer] = useState(null);
  const [primosDetails, setPrimosDetails] = useState([{ relationship: "", type: null, age: "", showAgeDropdown: false }]);

  const handleCancerChange = (value) => {
    setPrimosHadCancer(value);
    if (value === true || value === false) {
      setNoKnowledge(false);
    }
  };

  const handleAddMore = () => {
    setPrimosDetails([...primosDetails, { relationship: "", type: null, age: "", showAgeDropdown: false }]);
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
    <div className="ppm-modal-overlay" onClick={onClose}>
      <div className="ppm-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa2" />
        <div className="ppm-form-container">
          <button className="ppm-close-button" onClick={onClose}>
            &times;
          </button>
          <div className="ppm-grupo">
            <h2 className="ppm-title">Etapa 2 - Primos e primas</h2>

            <label>
              Algum primo ou prima do seu lado materno já teve câncer?
              <div className="ppm-checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="primosCancer"
                    checked={primosHadCancer === true}
                    onChange={() => handleCancerChange(true)}
                  />
                  Algum/alguns primos maternos já foram acometidos
                </label>
                <label>
                  <input
                    type="radio"
                    name="primosCancer"
                    checked={primosHadCancer === false}
                    onChange={() => handleCancerChange(false)}
                  />
                  Nenhum dos meus primos maternos foram acometidos
                </label>
                <label>
                  <input
                    type="radio"
                    name="primosCancer"
                    checked={noKnowledge}
                    onChange={() => {
                      setNoKnowledge(true);
                      setPrimosHadCancer(null);
                    }}
                  />
                  Não tenho conhecimento da saúde dos meus primos maternos
                </label>
              </div>
            </label>

            {primosHadCancer && !noKnowledge && (
              <>
                {primosDetails.map((primo, index) => (
                  <div key={index}>
                    <label>
                      Parentesco:
                      <select
                        value={primo.relationship}
                        onChange={(e) => {
                          const newDetails = [...primosDetails];
                          newDetails[index].relationship = e.target.value;
                          setPrimosDetails(newDetails);
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="primo">Primo</option>
                        <option value="prima">Prima</option>
                      </select>
                    </label>
                    <label>
                      Tipo de câncer:
                      <Select
                        isMulti
                        placeholder="Selecione os tipos de câncer desse familiar"
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
                      {primo.showAgeDropdown ? (
                        <Select
                          placeholder="Selecione.."
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
                      <button type="button" className="ppm-toggle-button" onClick={() => {
                        const newDetails = [...primosDetails];
                        newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
                        setPrimosDetails(newDetails);
                      }}>
                        {primo.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                    </label>
                  </div>
                ))}
                <button type="button" className="ppm-btn-add" onClick={handleAddMore}>
                  Informar+
                </button>
              </>
            )}

            <div className="ppm-form-buttons">
              <button className="ppm-btn-back" onClick={handleBackClick}>
                Voltar
              </button>
              <button className="ppm-btn-next" onClick={handleAdvanceClick}>
                Avançar
              </button>
            </div>
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
