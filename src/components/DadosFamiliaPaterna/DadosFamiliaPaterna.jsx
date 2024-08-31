import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./DadosFamiliaPaterna.css"; // Ensure you have a new CSS file for this component

export default function DadosFamiliaPaterna({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [fatherHadCancer, setFatherHadCancer] = useState(false);
  const [fatherCancerDetails, setFatherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [hasPaternalUnclesAunts, setHasPaternalUnclesAunts] = useState(false);
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState({
    tios: "",
    tias: "",
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(false);
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState({
    tiosComCancer: "",
    tiasComCancer: "",
  });

  const handleNoKnowledgeChange = () => {
    setNoKnowledge(!noKnowledge);
  };

  const handleFatherHadCancerChange = (value) => {
    setFatherHadCancer(value === "sim");
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleUncleAuntCancerChange = (value) => {
    setUncleAuntCancer(value === "sim");
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    onBack();
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  return (
    <div className="dfp-modal-overlay" onClick={onClose}>
      <div className="dfp-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa3" />
        <div className="dfp-form-container">
          <button className="dfp-close-button" onClick={onClose}>
            &times;
          </button>
          <h2 className="dfp-title">Etapa 3 - Dados da família paterna</h2>

          <label className="dfp-label">
            <input
              type="checkbox"
              checked={noKnowledge}
              onChange={handleNoKnowledgeChange}
              className="dfp-checkbox"
            />
            Não tenho conhecimento da saúde e família do meu pai biológico.
          </label>

          {!noKnowledge && (
            <>
              <label className="dfp-label">
                O pai do Sr(a) já teve câncer?
                <div className="dfp-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={fatherHadCancer === true}
                      onChange={() => handleFatherHadCancerChange("sim")}
                      className="dfp-checkbox"
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={fatherHadCancer === false}
                      onChange={() => handleFatherHadCancerChange("não")}
                      className="dfp-checkbox"
                    />
                    Não
                  </label>
                </div>
              </label>

              {fatherHadCancer && (
                <>
                  <label className="dfp-label">
                    Qual foi o tipo de câncer que ele teve?
                    <Select
                      placeholder="Selecione o tipo de câncer"
                      options={cancerOptions}
                      value={fatherCancerDetails.type}
                      onChange={(selectedOption) => {
                        setFatherCancerDetails((prev) => ({
                          ...prev,
                          type: selectedOption,
                        }));
                      }}
                      className="dfp-select"
                    />
                  </label>

                  <label className="dfp-label">
                    <div className="dfp-idade">
                      <span>
                        Idade
                        {showAgeDropdown ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={ageOptions}
                            value={fatherCancerDetails.age}
                            onChange={(selectedOption) => {
                              setFatherCancerDetails((prev) => ({
                                ...prev,
                                age: selectedOption,
                              }));
                            }}
                            className="dfp-select"
                          />
                        ) : (
                          <input
                            type="number"
                            value={fatherCancerDetails.age}
                            onChange={(e) =>
                              setFatherCancerDetails((prev) => ({
                                ...prev,
                                age: e.target.value,
                              }))
                            }
                            className="dfp-input"
                          />
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={handleAgeToggle}
                        className="dfp-toggle-button"
                      >
                        {showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                    </div>
                  </label>
                </>
              )}

              <label className="dfp-label">
                O Sr(a) tem tios e tias por parte de pai?
                <div className="dfp-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={hasPaternalUnclesAunts === true}
                      onChange={() => setHasPaternalUnclesAunts(true)}
                      className="dfp-checkbox"
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={hasPaternalUnclesAunts === false}
                      onChange={() => setHasPaternalUnclesAunts(false)}
                      className="dfp-checkbox"
                    />
                    Não
                  </label>
                </div>
              </label>

              {hasPaternalUnclesAunts && (
                <>
                  <label className="dfp-label">
                    Quantos tios?
                    <input
                      type="number"
                      value={uncleAuntQuantities.tios}
                      onChange={(e) =>
                        setUncleAuntQuantities((prev) => ({
                          ...prev,
                          tios: e.target.value,
                        }))
                      }
                      placeholder="Quantidade"
                      className="dfp-input"
                    />
                  </label>

                  <label className="dfp-label">
                    Quantas tias?
                    <input
                      type="number"
                      value={uncleAuntQuantities.tias}
                      onChange={(e) =>
                        setUncleAuntQuantities((prev) => ({
                          ...prev,
                          tias: e.target.value,
                        }))
                      }
                      placeholder="Quantidade"
                      className="dfp-input"
                    />
                  </label>

                  <label className="dfp-label">
                    Algum deles já teve câncer?
                    <div className="dfp-checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          value="sim"
                          checked={uncleAuntCancer === true}
                          onChange={() => handleUncleAuntCancerChange("sim")}
                          className="dfp-checkbox"
                        />
                        Sim
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="não"
                          checked={uncleAuntCancer === false}
                          onChange={() => handleUncleAuntCancerChange("não")}
                          className="dfp-checkbox"
                        />
                        Não
                      </label>
                    </div>
                  </label>

                  {uncleAuntCancer && (
                    <>
                      <label className="dfp-label">
                        Quantos tios tiveram câncer?
                        <input
                          type="number"
                          value={uncleAuntCancerDetails.tiosComCancer}
                          onChange={(e) =>
                            setUncleAuntCancerDetails((prev) => ({
                              ...prev,
                              tiosComCancer: e.target.value,
                            }))
                          }
                          placeholder="Quantidade"
                          className="dfp-input"
                        />
                      </label>

                      <label className="dfp-label">
                        Quantas tias tiveram câncer?
                        <input
                          type="number"
                          value={uncleAuntCancerDetails.tiasComCancer}
                          onChange={(e) =>
                            setUncleAuntCancerDetails((prev) => ({
                              ...prev,
                              tiasComCancer: e.target.value,
                            }))
                          }
                          placeholder="Quantidade"
                          className="dfp-input"
                        />
                      </label>
                    </>
                  )}
                </>
              )}
            </>
          )}

          <div className="dfp-form-buttons">
            <button className="dfp-btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="dfp-btn-next" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DadosFamiliaPaterna.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
