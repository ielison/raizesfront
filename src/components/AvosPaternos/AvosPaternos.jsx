import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./AvosPaternos.css"; // Updated CSS file

export default function AvosPaternos({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [grandmotherHadCancer, setGrandmotherHadCancer] = useState(false);
  const [grandfatherHadCancer, setGrandfatherHadCancer] = useState(false);
  const [grandmotherCancerDetails, setGrandmotherCancerDetails] = useState({
    type: null,
    age: "",
    showAgeDropdown: false,
  });
  const [grandfatherCancerDetails, setGrandfatherCancerDetails] = useState({
    type: null,
    age: "",
    showAgeDropdown: false,
  });

  // State to hold additional cancer details for grandmother and grandfather
  const [additionalGrandmotherCancer, setAdditionalGrandmotherCancer] = useState([]);
  const [additionalGrandfatherCancer, setAdditionalGrandfatherCancer] = useState([]);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge((prev) => !prev);
    // Clear cancer details if selecting "Não tenho conhecimento"
    if (!noKnowledge) {
      setGrandmotherHadCancer(false);
      setGrandfatherHadCancer(false);
      setGrandmotherCancerDetails({ type: null, age: "", showAgeDropdown: false });
      setGrandfatherCancerDetails({ type: null, age: "", showAgeDropdown: false });
      setAdditionalGrandmotherCancer([]); // Clear additional cancer fields
      setAdditionalGrandfatherCancer([]); // Clear additional cancer fields
    }
  };

  const handleNoGrandparentsCancerChange = () => {
    setGrandmotherHadCancer(false);
    setGrandfatherHadCancer(false);
    setNoKnowledge(false); // Reset knowledge if this option is selected
  };

  const handleAgeToggle = (setDetails) => {
    setDetails((prev) => ({
      ...prev,
      showAgeDropdown: !prev.showAgeDropdown,
    }));
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    onBack();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  // Function to add more cancer fields for grandmother
  const addMoreGrandmotherCancer = () => {
    setAdditionalGrandmotherCancer((prev) => [
      ...prev,
      { type: null, age: "" },
    ]);
  };

  // Function to add more cancer fields for grandfather
  const addMoreGrandfatherCancer = () => {
    setAdditionalGrandfatherCancer((prev) => [
      ...prev,
      { type: null, age: "" },
    ]);
  };

  return (
    <div className="avosp-modal-overlay" onClick={onClose}>
      <div className="avosp-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa3" />
        <div className="avosp-form-container">
          <button className="avosp-close-button" onClick={onClose}>
            &times;
          </button>
          <div className="avosp-grupo">
            <h2>Etapa 3 - Avós Paternos</h2>
            <label className="avosp-label">
              Os seus avós paternos já tiveram câncer?
              <div className="avosp-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={grandmotherHadCancer}
                    onChange={() => setGrandmotherHadCancer(!grandmotherHadCancer)}
                    className="avosp-checkbox"
                  />
                  Minha avó teve câncer
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={grandfatherHadCancer}
                    onChange={() => setGrandfatherHadCancer(!grandfatherHadCancer)}
                    className="avosp-checkbox"
                  />
                  Meu avô teve câncer
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!grandmotherHadCancer && !grandfatherHadCancer && !noKnowledge}
                    onChange={handleNoGrandparentsCancerChange}
                    className="avosp-checkbox"
                  />
                  Nenhum dos meus avós paternos foram acometidos
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={noKnowledge}
                    onChange={handleNoKnowledgeChange}
                    className="avosp-checkbox"
                  />
                  Não tenho conhecimento da saúde dos meus avós paternos
                </label>
              </div>
            </label>

            {!noKnowledge && (
              <>
                {grandmotherHadCancer && (
                  <>
                    <label className="avosp-label">
                      Tipo de câncer da minha avó:
                      <Select
                        placeholder="Selecione o tipo de câncer"
                        options={cancerOptions}
                        value={grandmotherCancerDetails.type}
                        onChange={(selectedOption) =>
                          setGrandmotherCancerDetails((prev) => ({
                            ...prev,
                            type: selectedOption,
                          }))
                        }
                        className="avosp-select"
                      />
                    </label>
                    <label className="avosp-label">
                      Idade
                      {grandmotherCancerDetails.showAgeDropdown ? (
                        <Select
                          options={ageOptions}
                          value={grandmotherCancerDetails.age}
                          onChange={(selectedOption) =>
                            setGrandmotherCancerDetails((prev) => ({
                              ...prev,
                              age: selectedOption,
                            }))
                          }
                          className="avosp-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={grandmotherCancerDetails.age}
                          onChange={(e) =>
                            setGrandmotherCancerDetails((prev) => ({
                              ...prev,
                              age: e.target.value,
                            }))
                          }
                          className="avosp-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleAgeToggle(setGrandmotherCancerDetails)}
                        className="avosp-toggle-button"
                      >
                        {grandmotherCancerDetails.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      {/* Button to add more cancer information */}
                      <button
                        type="button"
                        onClick={addMoreGrandmotherCancer}
                        className="avosp-add-button"
                      >
                        Informar+
                      </button>
                    </label>

                    {/* Render additional cancer fields for grandmother */}
                    {additionalGrandmotherCancer.map((details, index) => (
                      <div key={index}>
                        <label className="avosp-label">
                          Tipo de câncer adicional da minha avó:
                          <Select
                            placeholder="Selecione o tipo de câncer"
                            options={cancerOptions}
                            value={details.type}
                            onChange={(selectedOption) => {
                              const newDetails = [...additionalGrandmotherCancer];
                              newDetails[index].type = selectedOption;
                              setAdditionalGrandmotherCancer(newDetails);
                            }}
                            className="avosp-select"
                          />
                        </label>
                        <label className="avosp-label">
                          Idade
                          <input
                            type="number"
                            value={details.age}
                            onChange={(e) => {
                              const newDetails = [...additionalGrandmotherCancer];
                              newDetails[index].age = e.target.value;
                              setAdditionalGrandmotherCancer(newDetails);
                            }}
                            className="avosp-input"
                          />
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {grandfatherHadCancer && (
                  <>
                    <label className="avosp-label">
                      Tipo de câncer do meu avô:
                      <Select
                        options={cancerOptions}
                        value={grandfatherCancerDetails.type}
                        onChange={(selectedOption) =>
                          setGrandfatherCancerDetails((prev) => ({
                            ...prev,
                            type: selectedOption,
                          }))
                        }
                        className="avosp-select"
                      />
                    </label>
                    <label className="avosp-label">
                      Idade
                      {grandfatherCancerDetails.showAgeDropdown ? (
                        <Select
                          options={ageOptions}
                          value={grandfatherCancerDetails.age}
                          onChange={(selectedOption) =>
                            setGrandfatherCancerDetails((prev) => ({
                              ...prev,
                              age: selectedOption,
                            }))
                          }
                          className="avosp-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={grandfatherCancerDetails.age}
                          onChange={(e) =>
                            setGrandfatherCancerDetails((prev) => ({
                              ...prev,
                              age: e.target.value,
                            }))
                          }
                          className="avosp-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleAgeToggle(setGrandfatherCancerDetails)}
                        className="avosp-toggle-button"
                      >
                        {grandfatherCancerDetails.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      {/* Button to add more cancer information */}
                      <button
                        type="button"
                        onClick={addMoreGrandfatherCancer}
                        className="avosp-add-button"
                      >
                        Informar+
                      </button>
                    </label>

                    {/* Render additional cancer fields for grandfather */}
                    {additionalGrandfatherCancer.map((details, index) => (
                      <div key={index}>
                        <label className="avosp-label">
                          Tipo de câncer adicional do meu avô:
                          <Select
                            options={cancerOptions}
                            value={details.type}
                            onChange={(selectedOption) => {
                              const newDetails = [...additionalGrandfatherCancer];
                              newDetails[index].type = selectedOption;
                              setAdditionalGrandfatherCancer(newDetails);
                            }}
                            className="avosp-select"
                          />
                        </label>
                        <label className="avosp-label">
                          Idade
                          <input
                            type="number"
                            value={details.age}
                            onChange={(e) => {
                              const newDetails = [...additionalGrandfatherCancer];
                              newDetails[index].age = e.target.value;
                              setAdditionalGrandfatherCancer(newDetails);
                            }}
                            className="avosp-input"
                          />
                        </label>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            <div className="avosp-button-container">
              <button onClick={handleBackClick} className="avosp-button">
                Voltar
              </button>
              <button onClick={handleAdvanceClick} className="avosp-button">
                Avançar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AvosPaternos.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
