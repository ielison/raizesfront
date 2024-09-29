import { useState } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./AvosMaternos2.css";
import InfoIcon from "../../assets/information-2-fill.svg"; // Importe o SVG aqui

export default function AvosMaternos2() {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [grandmotherHadCancer, setGrandmotherHadCancer] = useState(false);
  const [grandfatherHadCancer, setGrandfatherHadCancer] = useState(false);
  const [grandmotherCancerDetails, setGrandmotherCancerDetails] = useState([]);
  const [grandfatherCancerDetails, setGrandfatherCancerDetails] = useState([]);

  const handleCancerTypeChangeGrandmother = (selectedOptions) => {
    const updatedDetails = selectedOptions.map((option) => {
      const existingDetail = grandmotherCancerDetails.find(
        (detail) => detail.type.value === option.value
      );
      return existingDetail || { type: option, age: "", showAgeDropdown: false };
    });
    setGrandmotherCancerDetails(updatedDetails);
  };

  const handleCancerTypeChangeGrandfather = (selectedOptions) => {
    const updatedDetails = selectedOptions.map((option) => {
      const existingDetail = grandfatherCancerDetails.find(
        (detail) => detail.type.value === option.value
      );
      return existingDetail || { type: option, age: "", showAgeDropdown: false };
    });
    setGrandfatherCancerDetails(updatedDetails);
  };

  const handleNoKnowledgeChange = () => {
    setNoKnowledge((prev) => !prev);
    if (!noKnowledge) {
      setGrandmotherHadCancer(false);
      setGrandfatherHadCancer(false);
      setGrandmotherCancerDetails([]);
      setGrandfatherCancerDetails([]);
    }
  };

  const handleNoGrandparentsCancerChange = () => {
    setGrandmotherHadCancer(false);
    setGrandfatherHadCancer(false);
    setNoKnowledge(false);
  };

  const handleAgeToggle = (index, isGrandmother) => {
    const setter = isGrandmother
      ? setGrandmotherCancerDetails
      : setGrandfatherCancerDetails;
    setter((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
      return newDetails;
    });
  };

  return (
    <div className="avosm-form-container">
      <div className="avosm-grupo">
        <label className="avosm-label">
          Os seus avós maternos já tiveram câncer?
          <div className="avosm-checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={grandmotherHadCancer}
                onChange={() => setGrandmotherHadCancer(!grandmotherHadCancer)}
                className="avosm-checkbox"
              />
              Minha avó teve câncer
            </label>
            <label>
              <input
                type="checkbox"
                checked={grandfatherHadCancer}
                onChange={() => setGrandfatherHadCancer(!grandfatherHadCancer)}
                className="avosm-checkbox"
              />
              Meu avô teve câncer
            </label>
            <label>
              <input
                type="checkbox"
                checked={
                  !grandmotherHadCancer && !grandfatherHadCancer && !noKnowledge
                }
                onChange={handleNoGrandparentsCancerChange}
                className="avosm-checkbox"
              />
              Nenhum dos meus avós maternos foram acometidos
            </label>
            <label>
              <input
                type="checkbox"
                checked={noKnowledge}
                onChange={handleNoKnowledgeChange}
                className="avosm-checkbox"
              />
              Não tenho conhecimento da saúde dos meus avós maternos
            </label>
          </div>
        </label>

        {!noKnowledge && (
          <>
            {grandmotherHadCancer && (
              <>
                <label className="avosm-label">
                  Tipo de câncer da minha avó:
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={grandmotherCancerDetails.map(
                      (detail) => detail.type
                    )}
                    onChange={handleCancerTypeChangeGrandmother}
                    className="avosm-select"
                  />
                </label>

                {/* Renderizar campos de idade para cada tipo de câncer selecionado */}
                {grandmotherCancerDetails.map((detail, index) => (
                  <div key={index}>
                    <label className="avosm-label">
                      Idade do diagnóstico de {detail.type.label}:
                      {detail.showAgeDropdown ? (
                        <Select
                          placeholder="Selecione a idade"
                          options={ageOptions}
                          value={detail.age}
                          onChange={(selectedOption) =>
                            setGrandmotherCancerDetails((prevDetails) => {
                              const newDetails = [...prevDetails];
                              newDetails[index].age = selectedOption;
                              return newDetails;
                            })
                          }
                          className="avosm-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={detail.age}
                          onChange={(e) =>
                            setGrandmotherCancerDetails((prevDetails) => {
                              const newDetails = [...prevDetails];
                              newDetails[index].age = e.target.value;
                              return newDetails;
                            })
                          }
                          className="avosm-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleAgeToggle(index, true)}
                        className="avosm-toggle-button"
                      >
                        {detail.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        }
                      />
                      {tooltipIndex === index && (
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </>
            )}

            {grandfatherHadCancer && (
              <>
                <label className="avosm-label">
                  Tipo de câncer do meu avô:
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={grandfatherCancerDetails.map(
                      (detail) => detail.type
                    )}
                    onChange={handleCancerTypeChangeGrandfather}
                    className="avosm-select"
                  />
                </label>

                {/* Renderizar campos de idade para cada tipo de câncer selecionado */}
                {grandfatherCancerDetails.map((detail, index) => (
                  <div key={index}>
                    <label className="avosm-label">
                    Idade para o diagnóstico de {detail.type.label}:
                      {detail.showAgeDropdown ? (
                        <Select
                          placeholder="Selecione a idade"
                          options={ageOptions}
                          value={detail.age}
                          onChange={(selectedOption) =>
                            setGrandfatherCancerDetails((prevDetails) => {
                              const newDetails = [...prevDetails];
                              newDetails[index].age = selectedOption;
                              return newDetails;
                            })
                          }
                          className="avosm-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={detail.age}
                          onChange={(e) =>
                            setGrandfatherCancerDetails((prevDetails) => {
                              const newDetails = [...prevDetails];
                              newDetails[index].age = e.target.value;
                              return newDetails;
                            })
                          }
                          className="avosm-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleAgeToggle(index, false)}
                        className="avosm-toggle-button"
                      >
                        {detail.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        }
                      />
                      {tooltipIndex === index && (
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
