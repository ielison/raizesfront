import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./DadosFamiliaMaterna.css";

export default function DadosFamiliaMaterna({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [motherHadCancer, setMotherHadCancer] = useState(false);
  const [motherCancerDetails, setMotherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [hasMaternalUnclesAunts, setHasMaternalUnclesAunts] = useState(false);
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState({
    tios: "",
    tias: "",
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(false);
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState([
    { type: [], parentesco: "", age: "" },
  ]);
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge(!noKnowledge);
  };

  const handleMotherHadCancerChange = (value) => {
    setMotherHadCancer(value === "sim");
  };

  const handleAgeToggle = (index) => {
    const newShowAgeDropdowns = [...showAgeDropdowns];
    newShowAgeDropdowns[index] = !newShowAgeDropdowns[index];
    setShowAgeDropdowns(newShowAgeDropdowns);
  };

  const handleUncleAuntCancerChange = (value) => {
    setUncleAuntCancer(value === "sim");
  };

  const handleAddCancerDetail = () => {
    setUncleAuntCancerDetails([
      ...uncleAuntCancerDetails,
      { type: [], parentesco: "", age: "" },
    ]);
    setShowAgeDropdowns([...showAgeDropdowns, false]);
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  return (
    <div className="dfm-modal-overlay" onClick={onClose}>
      <div className="dfm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dfm-form-container">
          <div className="dfm-header">
            <h2 className="dfm-title">Etapa 2 - Dados da família materna</h2>
            <button className="dfm-close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <label className="dfm-label">
            <input
              type="checkbox"
              checked={noKnowledge}
              onChange={handleNoKnowledgeChange}
              className="dfm-checkbox"
            />
            Não tenho conhecimento da saúde e família da minha mãe biológica.
          </label>

          {!noKnowledge && (
            <>
              <label className="dfm-label">
                A mãe do Sr(a) já teve câncer?
                <div className="dfm-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={motherHadCancer === true}
                      onChange={() => handleMotherHadCancerChange("sim")}
                      className="dfm-checkbox"
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={motherHadCancer === false}
                      onChange={() => handleMotherHadCancerChange("não")}
                      className="dfm-checkbox"
                    />
                    Não
                  </label>
                </div>
              </label>

              {motherHadCancer && (
                <>
                  <label className="dfm-label">
                    Qual foi o tipo de câncer que ela teve?
                    <Select
                      placeholder="Selecione o tipo de câncer"
                      options={cancerOptions}
                      value={motherCancerDetails.type}
                      onChange={(selectedOption) => {
                        setMotherCancerDetails((prev) => ({
                          ...prev,
                          type: selectedOption,
                        }));
                      }}
                      className="dfm-select"
                    />
                  </label>

                  <label className="dfm-label">
                    <div className="dfm-idade">
                      <span>
                        Idade
                        {showAgeDropdowns[0] ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={ageOptions}
                            value={motherCancerDetails.age}
                            onChange={(selectedOption) => {
                              setMotherCancerDetails((prev) => ({
                                ...prev,
                                age: selectedOption,
                              }));
                            }}
                            className="dfm-select"
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
                            className="dfm-input"
                          />
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAgeToggle(0)}
                        className="dfm-toggle-button"
                      >
                        {showAgeDropdowns[0] ? "Digitar idade" : "Não sei"}
                      </button>
                    </div>
                  </label>
                </>
              )}

              <label className="dfm-label">
                O Sr(a) tem tios e tias por parte de mãe?
                <div className="dfm-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={hasMaternalUnclesAunts === true}
                      onChange={() => setHasMaternalUnclesAunts(true)}
                      className="dfm-checkbox"
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="não"
                      checked={hasMaternalUnclesAunts === false}
                      onChange={() => setHasMaternalUnclesAunts(false)}
                      className="dfm-checkbox"
                    />
                    Não
                  </label>
                </div>
              </label>

              {hasMaternalUnclesAunts && (
                <>
                  <label className="dfm-label">
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
                      className="dfm-input"
                    />
                  </label>

                  <label className="dfm-label">
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
                      className="dfm-input"
                    />
                  </label>

                  <label className="dfm-label">
                    Algum deles já teve câncer?
                    <div className="dfm-checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          value="sim"
                          checked={uncleAuntCancer === true}
                          onChange={() => handleUncleAuntCancerChange("sim")}
                          className="dfm-checkbox"
                        />
                        Sim
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="não"
                          checked={uncleAuntCancer === false}
                          onChange={() => handleUncleAuntCancerChange("não")}
                          className="dfm-checkbox"
                        />
                        Não
                      </label>
                    </div>
                  </label>

                  {uncleAuntCancer && (
                    <>
                      {uncleAuntCancerDetails.map((detail, index) => (
                        <div key={index} className="dfm-cancer-detail">
                          <label className="dfm-label">
                            Tipo de câncer
                            <Select
                              placeholder="Selecione o tipo de câncer"
                              options={cancerOptions}
                              value={detail.type}
                              onChange={(selectedOptions) => {
                                const newDetails = [...uncleAuntCancerDetails];
                                newDetails[index].type = selectedOptions;
                                setUncleAuntCancerDetails(newDetails);
                              }}
                              className="dfm-select"
                            />
                          </label>

                          <label className="dfm-label">
                            Parentesco
                            <select
                              value={detail.parentesco}
                              onChange={(e) => {
                                const newDetails = [...uncleAuntCancerDetails];
                                newDetails[index].parentesco = e.target.value;
                                setUncleAuntCancerDetails(newDetails);
                              }}
                              className="dfm-select"
                            >
                              <option value="">Selecione</option>
                              <option value="tio">Tio</option>
                              <option value="tia">Tia</option>
                            </select>
                          </label>

                          <label className="dfm-label">
                            <div className="dfm-idade">
                              <span>
                                Idade
                                {showAgeDropdowns[index] ? (
                                  <Select
                                    placeholder="Selecione a idade"
                                    options={ageOptions}
                                    value={detail.age}
                                    onChange={(selectedOption) => {
                                      const newDetails = [
                                        ...uncleAuntCancerDetails,
                                      ];
                                      newDetails[index].age = selectedOption;
                                      setUncleAuntCancerDetails(newDetails);
                                    }}
                                    className="dfm-select"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    value={detail.age}
                                    onChange={(e) => {
                                      const newDetails = [
                                        ...uncleAuntCancerDetails,
                                      ];
                                      newDetails[index].age = e.target.value;
                                      setUncleAuntCancerDetails(newDetails);
                                    }}
                                    className="dfm-input"
                                  />
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAgeToggle(index)}
                                className="dfm-toggle-button"
                              >
                                {showAgeDropdowns[index]
                                  ? "Digitar idade"
                                  : "Não sei"}
                              </button>
                            </div>
                          </label>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddCancerDetail}
                        className="dfm-add-button"
                      >
                        Adicionar outro caso
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}

          <div className="dfm-buttons">
            <button
              type="button"
              className="dfm-button dfm-back-button"
              onClick={handleBackClick}
            >
              Voltar
            </button>
            <button
              type="button"
              className="dfm-button dfm-advance-button"
              onClick={handleAdvanceClick}
            >
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
