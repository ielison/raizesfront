import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./DadosFamiliaPaterna.css";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa3" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 3 - Dados da família paterna</h2>

          <label>
            <input
              type="checkbox"
              checked={noKnowledge}
              onChange={handleNoKnowledgeChange}
            />
            Não tenho conhecimento da saúde e família do meu pai biológico.
          </label>

          {!noKnowledge && (
            <>
              <label>
                O pai do Sr(a) já teve câncer?
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={fatherHadCancer === true}
                      onChange={() => handleFatherHadCancerChange("sim")}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={fatherHadCancer === false}
                      onChange={() => handleFatherHadCancerChange("não")}
                    />
                    Não
                  </label>
                </div>
              </label>

              {fatherHadCancer && (
                <>
                  <label>
                    Qual foi o tipo de câncer que ele teve?
                    <Select
                      options={cancerOptions}
                      value={fatherCancerDetails.type}
                      onChange={(selectedOption) => {
                        setFatherCancerDetails((prev) => ({
                          ...prev,
                          type: selectedOption,
                        }));
                      }}
                    />
                  </label>

                  <label>
                    Idade
                    {showAgeDropdown ? (
                      <Select
                        options={ageOptions}
                        value={fatherCancerDetails.age}
                        onChange={(selectedOption) => {
                          setFatherCancerDetails((prev) => ({
                            ...prev,
                            age: selectedOption,
                          }));
                        }}
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
                      />
                    )}
                    <button type="button" onClick={handleAgeToggle}>
                      {showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
                </>
              )}

              <label>
                O Sr(a) tem tios e tias por parte de pai?
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={hasPaternalUnclesAunts === true}
                      onChange={() => setHasPaternalUnclesAunts(true)}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={hasPaternalUnclesAunts === false}
                      onChange={() => setHasPaternalUnclesAunts(false)}
                    />
                    Não
                  </label>
                </div>
              </label>

              {hasPaternalUnclesAunts && (
                <>
                  <label>
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
                    />
                  </label>

                  <label>
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
                    />
                  </label>

                  <label>
                    Algum deles já teve câncer?
                    <div className="checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          value="sim"
                          checked={uncleAuntCancer === true}
                          onChange={() => handleUncleAuntCancerChange("sim")}
                        />
                        Sim
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="não"
                          checked={uncleAuntCancer === false}
                          onChange={() => handleUncleAuntCancerChange("não")}
                        />
                        Não
                      </label>
                    </div>
                  </label>

                  {uncleAuntCancer && (
                    <>
                      <label>
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
                        />
                      </label>

                      <label>
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
                        />
                      </label>
                    </>
                  )}
                </>
              )}
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

DadosFamiliaPaterna.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
