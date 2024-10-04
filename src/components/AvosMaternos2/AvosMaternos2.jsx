import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import PropTypes from "prop-types";
import DeleteIcon from "../../assets/trash.svg";
import "./AvosMaternos2.css"

export default function AvosMaternos2({ onFormChange, initialData = {} }) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(() => {
    const stored = localStorage.getItem("am2_noKnowledge");
    return stored ? JSON.parse(stored) : initialData?.noKnowledge || false;
  });
  const [grandmotherHadCancer, setGrandmotherHadCancer] = useState(() => {
    const stored = localStorage.getItem("am2_grandmotherHadCancer");
    return stored
      ? JSON.parse(stored)
      : initialData?.avosListMaterno?.some(
          (avo) => avo.sexo === "feminino" && avo.teveCancer
        ) || false;
  });
  const [grandfatherHadCancer, setGrandfatherHadCancer] = useState(() => {
    const stored = localStorage.getItem("am2_grandfatherHadCancer");
    return stored
      ? JSON.parse(stored)
      : initialData?.avosListMaterno?.some(
          (avo) => avo.sexo === "masculino" && avo.teveCancer
        ) || false;
  });
  const [grandmotherCancerDetails, setGrandmotherCancerDetails] = useState(
    () => {
      const stored = localStorage.getItem("am2_grandmotherCancerDetails");
      return stored
        ? JSON.parse(stored)
        : initialData?.avosListMaterno
            ?.find((avo) => avo.sexo === "feminino")
            ?.outroCancerList.map((cancer) => ({
              type: { value: cancer.tipoCancer, label: cancer.tipoCancer },
              age: cancer.idadeDiagnostico,
              showAgeDropdown: false,
            })) || [];
    }
  );
  const [grandfatherCancerDetails, setGrandfatherCancerDetails] = useState(
    () => {
      const stored = localStorage.getItem("am2_grandfatherCancerDetails");
      return stored
        ? JSON.parse(stored)
        : initialData?.avosListMaterno
            ?.find((avo) => avo.sexo === "masculino")
            ?.outroCancerList.map((cancer) => ({
              type: { value: cancer.tipoCancer, label: cancer.tipoCancer },
              age: cancer.idadeDiagnostico,
              showAgeDropdown: false,
            })) || [];
    }
  );

  const handleCancerTypeChangeGrandmother = (selectedOptions) => {
    const updatedDetails = selectedOptions.map((option) => {
      const existingDetail = grandmotherCancerDetails.find(
        (detail) => detail.type.value === option.value
      );
      return (
        existingDetail || { type: option, age: "", showAgeDropdown: false }
      );
    });
    setGrandmotherCancerDetails(updatedDetails);
    localStorage.setItem(
      "am2_grandmotherCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleDeleteCancerDetail = (index, isGrandmother) => {
    if (isGrandmother) {
      setGrandmotherCancerDetails((prevDetails) => {
        const newDetails = prevDetails.filter((_, i) => i !== index);
        localStorage.setItem(
          "am2_grandmotherCancerDetails",
          JSON.stringify(newDetails)
        );
        return newDetails;
      });
    } else {
      setGrandfatherCancerDetails((prevDetails) => {
        const newDetails = prevDetails.filter((_, i) => i !== index);
        localStorage.setItem(
          "am2_grandfatherCancerDetails",
          JSON.stringify(newDetails)
        );
        return newDetails;
      });
    }
  };

  const handleCancerTypeChangeGrandfather = (selectedOptions) => {
    const updatedDetails = selectedOptions.map((option) => {
      const existingDetail = grandfatherCancerDetails.find(
        (detail) => detail.type.value === option.value
      );
      return (
        existingDetail || { type: option, age: "", showAgeDropdown: false }
      );
    });
    setGrandfatherCancerDetails(updatedDetails);
    localStorage.setItem(
      "am2_grandfatherCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleNoKnowledgeChange = () => {
    const updatedValue = !noKnowledge;
    setNoKnowledge(updatedValue);
    localStorage.setItem("am2_noKnowledge", JSON.stringify(updatedValue));
    if (updatedValue) {
      setGrandmotherHadCancer(false);
      setGrandfatherHadCancer(false);
      setGrandmotherCancerDetails([]);
      setGrandfatherCancerDetails([]);
      localStorage.setItem("am2_grandmotherHadCancer", JSON.stringify(false));
      localStorage.setItem("am2_grandfatherHadCancer", JSON.stringify(false));
      localStorage.setItem("am2_grandmotherCancerDetails", JSON.stringify([]));
      localStorage.setItem("am2_grandfatherCancerDetails", JSON.stringify([]));
    }
  };

  const handleNoGrandparentsCancerChange = () => {
    setGrandmotherHadCancer(false);
    setGrandfatherHadCancer(false);
    setNoKnowledge(false);
    localStorage.setItem("am2_grandmotherHadCancer", JSON.stringify(false));
    localStorage.setItem("am2_grandfatherHadCancer", JSON.stringify(false));
    localStorage.setItem("am2_noKnowledge", JSON.stringify(false));
  };

  const handleAgeToggle = (index, isGrandmother) => {
    const setter = isGrandmother
      ? setGrandmotherCancerDetails
      : setGrandfatherCancerDetails;
    const storageKey = isGrandmother
      ? "am2_grandmotherCancerDetails"
      : "am2_grandfatherCancerDetails";
    setter((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
      localStorage.setItem(storageKey, JSON.stringify(newDetails));
      return newDetails;
    });
  };

  useEffect(() => {
    let updatedAvosListMaterno = [];

    if (noKnowledge || (!grandmotherHadCancer && !grandfatherHadCancer)) {
      updatedAvosListMaterno = [
        {
          id: 0,
          teveCancer: false,
          sexo: "",
          ladoPaterno: "materno",
          outroCancerList: [],
        },
      ];
    } else {
      if (grandmotherHadCancer) {
        updatedAvosListMaterno.push({
          id: 0,
          teveCancer: true,
          sexo: "feminino",
          ladoPaterno: "materno",
          outroCancerList: grandmotherCancerDetails.map((detail) => ({
            id: 0,
            idadeDiagnostico: detail.age
              ? parseInt(detail.age.label || detail.age, 10)
              : 0,
            tipoCancer: detail.type.label,
          })),
        });
      }

      if (grandfatherHadCancer) {
        updatedAvosListMaterno.push({
          id: 1,
          teveCancer: true,
          sexo: "masculino",
          ladoPaterno: "materno",
          outroCancerList: grandfatherCancerDetails.map((detail) => ({
            id: 0,
            idadeDiagnostico: detail.age
              ? parseInt(detail.age.label || detail.age, 10)
              : 0,
            tipoCancer: detail.type.label,
          })),
        });
      }
    }

    onFormChange({ avosListMaterno: updatedAvosListMaterno });
  }, [
    noKnowledge,
    grandmotherHadCancer,
    grandfatherHadCancer,
    grandmotherCancerDetails,
    grandfatherCancerDetails,
    onFormChange,
  ]);

  return (
    <div className="avosm-form-container">
      <div className="avosm-grupo">
        <label className="avosm-label">
          Os seus avós maternos já tiveram câncer ou neoplasia?
          <div className="avosm-checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={grandmotherHadCancer}
                onChange={() => {
                  const updatedValue = !grandmotherHadCancer;
                  setGrandmotherHadCancer(updatedValue);
                  localStorage.setItem(
                    "am2_grandmotherHadCancer",
                    JSON.stringify(updatedValue)
                  );
                }}
                className="avosm-checkbox"
              />
              Minha avó teve câncer
            </label>
            <label>
              <input
                type="checkbox"
                checked={grandfatherHadCancer}
                onChange={() => {
                  const updatedValue = !grandfatherHadCancer;
                  setGrandfatherHadCancer(updatedValue);
                  localStorage.setItem(
                    "am2_grandfatherHadCancer",
                    JSON.stringify(updatedValue)
                  );
                }}
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
                  Tipo de câncer ou neoplasia da avó:
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

                {grandmotherCancerDetails.map((detail, index) => (
                  <div key={index}>
                    <label className="avos-idade">
                      <div>
                        Idade do diagnóstico para ({detail.type.label}):
                        {detail.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={ageOptions}
                            value={detail.age}
                            onChange={(selectedOption) => {
                              setGrandmotherCancerDetails((prevDetails) => {
                                const newDetails = [...prevDetails];
                                newDetails[index].age = selectedOption;
                                localStorage.setItem(
                                  "am2_grandmotherCancerDetails",
                                  JSON.stringify(newDetails)
                                );
                                return newDetails;
                              });
                            }}
                            className="avosm-select"
                          />
                        ) : (
                          <input
                            type="number"
                            value={detail.age}
                            onChange={(e) => {
                              setGrandmotherCancerDetails((prevDetails) => {
                                const newDetails = [...prevDetails];
                                newDetails[index].age = e.target.value;
                                localStorage.setItem(
                                  "am2_grandmotherCancerDetails",
                                  JSON.stringify(newDetails)
                                );
                                return newDetails;
                              });
                            }}
                            className="avosm-input"
                          />
                        )}
                      </div>
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
                    <button
                      className="avosm-btn-delete"
                      type="button"
                      onClick={() => handleDeleteCancerDetail(index, true)}
                    >
                      <img src={DeleteIcon} alt="Deletar" />
                    </button>
                  </div>
                ))}
              </>
            )}

            {grandfatherHadCancer && (
              <>
                <label className="avosm-label">
                  Tipo de câncer ou neoplasia do avô:
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

                {grandfatherCancerDetails.map((detail, index) => (
                  <div key={index}>
                    <label className="avos-idade">
                      <div>
                        Idade do diagnóstico para ({detail.type.label}):
                        {detail.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={ageOptions}
                            value={detail.age}
                            onChange={(selectedOption) => {
                              setGrandfatherCancerDetails((prevDetails) => {
                                const newDetails = [...prevDetails];
                                newDetails[index].age = selectedOption;
                                localStorage.setItem(
                                  "am2_grandfatherCancerDetails",
                                  JSON.stringify(newDetails)
                                );
                                return newDetails;
                              });
                            }}
                            className="avosm-select"
                          />
                        ) : (
                          <input
                            type="number"
                            value={detail.age}
                            onChange={(e) => {
                              setGrandfatherCancerDetails((prevDetails) => {
                                const newDetails = [...prevDetails];
                                newDetails[index].age = e.target.value;
                                localStorage.setItem(
                                  "am2_grandfatherCancerDetails",
                                  JSON.stringify(newDetails)
                                );
                                return newDetails;
                              });
                            }}
                            className="avosm-input"
                          />
                        )}
                      </div>
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
                    <button
                      className="avosm-btn-delete"
                      type="button"
                      onClick={() => handleDeleteCancerDetail(index, false)}
                    >
                      <img src={DeleteIcon} alt="Deletar" />
                    </button>
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

AvosMaternos2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    noKnowledge: PropTypes.bool,
    avosListMaterno: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        teveCancer: PropTypes.bool,
        sexo: PropTypes.string,
        ladoPaterno: PropTypes.string,
        outroCancerList: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            idadeDiagnostico: PropTypes.number,
            tipoCancer: PropTypes.string,
          })
        ),
      })
    ),
  }),
};
