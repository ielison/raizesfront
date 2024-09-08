import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./DadosFamiliaPaterna.css"; // Atualize o nome do arquivo CSS também

export default function DadosFamiliaPaterna({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [fatherHadCancer, setFatherHadCancer] = useState(false);
  const [fatherCancerDetails, setFatherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [hasPaternalUnclesAunts, setHasPaternalUnclesAunts] = useState(false);
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

  const handleFatherHadCancerChange = (value) => {
    setFatherHadCancer(value === "sim");
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
    <div className="dfp-modal-overlay" onClick={onClose}>
      <div className="dfp-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dfp-form-container">
          <div className="dfp-header">
            <h2 className="dfp-title">Etapa 2 - Dados da família paterna</h2>
            <button className="dfp-close-button" onClick={onClose}>
              &times;
            </button>
          </div>

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
                        {showAgeDropdowns[0] ? (
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
                        onClick={() => handleAgeToggle(0)}
                        className="dfp-toggle-button"
                      >
                        {showAgeDropdowns[0] ? "Digitar idade" : "Não sei"}
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
                      {uncleAuntCancerDetails.map((detail, index) => (
                        <div key={index} className="dfp-cancer-detail">
                          <label className="dfp-label">
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
                              className="dfp-select"
                            />
                          </label>

                          <label className="dfp-label">
                            Parentesco
                            <select
                              value={detail.parentesco}
                              onChange={(e) => {
                                const newDetails = [...uncleAuntCancerDetails];
                                newDetails[index].parentesco = e.target.value;
                                setUncleAuntCancerDetails(newDetails);
                              }}
                              className="dfp-select"
                            >
                              <option value="">Selecione</option>
                              <option value="tio">Tio</option>
                              <option value="tia">Tia</option>
                            </select>
                          </label>

                          <label className="dfp-label">
                            Idade
                            <div className="dfp-idade">
                              <span>
                                {showAgeDropdowns[index + 1] ? (
                                  <Select
                                    placeholder="Selecione a idade"
                                    options={ageOptions}
                                    value={detail.age}
                                    onChange={(selectedOption) => {
                                      const newDetails = [...uncleAuntCancerDetails];
                                      newDetails[index].age = selectedOption;
                                      setUncleAuntCancerDetails(newDetails);
                                    }}
                                    className="dfp-select"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    value={detail.age}
                                    onChange={(e) => {
                                      const newDetails = [...uncleAuntCancerDetails];
                                      newDetails[index].age = e.target.value;
                                      setUncleAuntCancerDetails(newDetails);
                                    }}
                                    className="dfp-input"
                                  />
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAgeToggle(index + 1)}
                                className="dfp-toggle-button"
                              >
                                {showAgeDropdowns[index + 1]
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
                        className="dfp-add-button"
                      >
                        Informar +
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}

          <div className="dfp-button-group">
            <button className="dfp-button" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="dfp-button" onClick={handleAdvanceClick}>
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
