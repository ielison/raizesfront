import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./AvosMaternos.css";

export default function AvosMaternos({ onClose, onBack, onAdvance }) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [grandmotherHadCancer, setGrandmotherHadCancer] = useState(false);
  const [grandfatherHadCancer, setGrandfatherHadCancer] = useState(false);
  const [grandmotherCancerDetails, setGrandmotherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [grandfatherCancerDetails, setGrandfatherCancerDetails] = useState({
    type: null,
    age: "",
  });
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge(!noKnowledge);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
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
        <h2>Etapa 2 - Avós Maternos</h2>
          <label>
            Os seus avós maternos já tiveram câncer?
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={grandmotherHadCancer}
                  onChange={() =>
                    setGrandmotherHadCancer(!grandmotherHadCancer)
                  }
                />
                Minha avó teve câncer
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={grandfatherHadCancer}
                  onChange={() =>
                    setGrandfatherHadCancer(!grandfatherHadCancer)
                  }
                />
                Meu avô teve câncer
              </label>
              <label>
                <input
                  type="checkbox"
                  value="none"
                  checked={!grandmotherHadCancer && !grandfatherHadCancer}
                  onChange={() => {
                    setGrandmotherHadCancer(false);
                    setGrandfatherHadCancer(false);
                  }}
                />
                Nenhum dos meus avós maternos foram acometidos
              </label>
              <label>
                <input
                  type="checkbox"
                  value="no-knowledge"
                  checked={noKnowledge}
                  onChange={handleNoKnowledgeChange}
                />
                Não tenho conhecimento da saúde dos meus avós maternos
              </label>
            </div>
          </label>

          {!noKnowledge && (
            <>
              {grandmotherHadCancer && (
                <>
                  <label>
                    Tipo de câncer da minha avó:
                    <Select
                      options={cancerOptions}
                      value={grandmotherCancerDetails.type}
                      onChange={(selectedOption) =>
                        setGrandmotherCancerDetails((prev) => ({
                          ...prev,
                          type: selectedOption,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Idade
                    {showAgeDropdown ? (
                      <Select
                        options={ageOptions}
                        value={grandmotherCancerDetails.age}
                        onChange={(selectedOption) =>
                          setGrandmotherCancerDetails((prev) => ({
                            ...prev,
                            age: selectedOption,
                          }))
                        }
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
                      />
                    )}
                    <button type="button" onClick={handleAgeToggle}>
                      {showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
                </>
              )}

              {grandfatherHadCancer && (
                <>
                  <label>
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
                    />
                  </label>
                  <label>
                    Idade
                    {showAgeDropdown ? (
                      <Select
                        options={ageOptions}
                        value={grandfatherCancerDetails.age}
                        onChange={(selectedOption) =>
                          setGrandfatherCancerDetails((prev) => ({
                            ...prev,
                            age: selectedOption,
                          }))
                        }
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
                      />
                    )}
                    <button type="button" onClick={handleAgeToggle}>
                      {showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
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

AvosMaternos.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
