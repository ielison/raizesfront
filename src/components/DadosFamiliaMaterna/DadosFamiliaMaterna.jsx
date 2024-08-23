import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./DadosFamiliaMaterna.css";

export default function DadosFamiliaMaterna({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [motherHadCancer, setMotherHadCancer] = useState(false);
  const [motherCancerDetails, setMotherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [hasMaternalUnclesAunts, setHasMaternalUnclesAunts] = useState(false);
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

  const handleMotherHadCancerChange = (value) => {
    setMotherHadCancer(value === "sim");
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
        <Sidebar activeEtapa="etapa2" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 2 - Dados da família materna</h2>

          <label>
            <input
              type="checkbox"
              checked={noKnowledge}
              onChange={handleNoKnowledgeChange}
            />
            Não tenho conhecimento da saúde e família da minha mãe biológica.
          </label>

          {!noKnowledge && (
            <>
              <label>
                A mãe do Sr(a) já teve câncer?
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={motherHadCancer === true}
                      onChange={() => handleMotherHadCancerChange("sim")}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={motherHadCancer === false}
                      onChange={() => handleMotherHadCancerChange("não")}
                    />
                    Não
                  </label>
                </div>
              </label>

              {motherHadCancer && (
                <>
                  <label>
                    Qual foi o tipo de câncer que ela teve?
                    <Select
                      options={cancerOptions}
                      value={motherCancerDetails.type}
                      onChange={(selectedOption) => {
                        setMotherCancerDetails((prev) => ({
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
                        value={motherCancerDetails.age}
                        onChange={(selectedOption) => {
                          setMotherCancerDetails((prev) => ({
                            ...prev,
                            age: selectedOption,
                          }));
                        }}
                      />
                    ) : (
                      <input
                        type="number"
                        value={motherCancerDetails.age}
                        onChange={(e) =>
                          setMotherCancerDetails((prev) => ({
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
                O Sr(a) tem tios e tias por parte de mãe?
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={hasMaternalUnclesAunts === true}
                      onChange={() => setHasMaternalUnclesAunts(true)}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={hasMaternalUnclesAunts === false}
                      onChange={() => setHasMaternalUnclesAunts(false)}
                    />
                    Não
                  </label>
                </div>
              </label>

              {hasMaternalUnclesAunts && (
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

DadosFamiliaMaterna.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
