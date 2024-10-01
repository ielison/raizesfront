import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import "./DadosFamiliaMaterna2.css";

export default function DadosFamiliaMaterna2({ onFormChange, initialData }) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(
    initialData?.noKnowledge || false
  );
  const [motherHadCancer, setMotherHadCancer] = useState(
    initialData?.mae?.teveCancer || false
  );
  const [motherCancerDetails, setMotherCancerDetails] = useState(
    initialData?.mae?.outroCancerList || []
  );
  const [hasMaternalUnclesAunts, setHasMaternalUnclesAunts] = useState(
    initialData?.tiosListMaterno?.length > 0 || false
  );
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState({
    tios:
      initialData?.tiosListMaterno?.filter((item) => item.sexo === "masculino")
        .length || "",
    tias:
      initialData?.tiosListMaterno?.filter((item) => item.sexo === "feminino")
        .length || "",
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(
    initialData?.tiosListMaterno?.some((item) => item.teveCancer) || false
  );
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState(
    initialData?.tiosListMaterno?.map((tio) => ({
      type: tio.outroCancerList[0]?.tipoCancer || null,
      parentesco: tio.sexo === "masculino" ? "tio" : "tia",
      age: tio.outroCancerList[0]?.idadeDiagnostico || "",
    })) || [{ type: null, parentesco: "tio", age: "" }]
  );
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]);

  const handleRelationChange = (index, selectedRelation) => {
    setUncleAuntCancerDetails((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, parentesco: selectedRelation } : d
      )
    );
  };

  const handleCancerTypeChange = (selectedOption) => {
    // Adiciona tipos de câncer ao estado
    const newCancerDetails = selectedOption.map((option) => ({
      type: option,
      age: "", // Inicializa a idade como vazia
      showAgeDropdown: false, // Inicializa a idade como vazia
    }));

    setMotherCancerDetails(newCancerDetails);
  };

  const handleAgeChange = (index, value) => {
    const updatedCancerDetails = [...motherCancerDetails];
    updatedCancerDetails[index].age = value;
    setMotherCancerDetails(updatedCancerDetails);
  };

  const toggleAgeInput = (index) => {
    const updatedCancerDetails = [...motherCancerDetails];
    updatedCancerDetails[index].showAgeDropdown =
      !updatedCancerDetails[index].showAgeDropdown;
    setMotherCancerDetails(updatedCancerDetails);
  };

  useEffect(() => {
    console.log("Valores antes da atualização:", {
      motherHadCancer,
      motherCancerDetails,
      hasMaternalUnclesAunts,
      uncleAuntQuantities,
      uncleAuntCancer,
      uncleAuntCancerDetails,
    });

    const updatedUserData = {
      ...initialData,
      mae: {
        id: 0,
        teveCancer: motherHadCancer,
        outroCancerList: motherCancerDetails.map((cancerDetail) => ({
          idadeDiagnostico: cancerDetail.age || 0,
          tipoCancer: cancerDetail.type?.value || "string",
        })),
      },
      tiosListMaterno: hasMaternalUnclesAunts
        ? uncleAuntCancerDetails.map((detail, index) => ({
            id: index,
            temTios: true,
            qtdTios: uncleAuntQuantities.tios,
            teveCancer: uncleAuntCancer,
            qtdTiosCancer: uncleAuntCancer ? uncleAuntCancerDetails.length : 0,
            ladoParterno: "materno",
            sexo: detail.parentesco === "tio" ? "masculino" : "feminino",
            outroCancerList: [
              {
                id: index,
                idadeDiagnostico: detail.age || 0,
                tipoCancer: detail.type ? detail.type[0]?.value : "", // Acessa o primeiro tipo
              },
            ],
          }))
        : [],
    };

    console.log("User Data Updated:", updatedUserData);
    onFormChange(updatedUserData);
  }, [
    motherHadCancer,
    motherCancerDetails,
    hasMaternalUnclesAunts,
    uncleAuntQuantities,
    uncleAuntCancer,
    uncleAuntCancerDetails,
    onFormChange,
    initialData,
  ]);

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
      { type: null, parentesco: "", age: "" },
    ]);
    setShowAgeDropdowns([...showAgeDropdowns, false]);
  };

  const validateAge = (value) => {
    // Ensure age is a non-negative number or an empty string
    return value >= 0 || value === "";
  };

  useEffect(() => {
    if (hasMaternalUnclesAunts) {
      sessionStorage.setItem(
        "tiosListMaterno",
        JSON.stringify(uncleAuntCancerDetails)
      );
    }
  }, [uncleAuntCancerDetails, hasMaternalUnclesAunts]);

  return (
    <div className="dfm-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="dfm-form-container">
        <label className="dfm-label">
          <input
            type="checkbox"
            checked={noKnowledge}
            onChange={handleNoKnowledgeChange}
            className="dfm-checkbox"
          />
          Não tenho conhecimento da saúde e família do minha mãe biológica.
        </label>

        {!noKnowledge && (
          <>
            <label className="dfm-label">
              A mãe do(a) Sr(a) já teve câncer ou neoplasia?
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
                  Qual foi o tipo de câncer ou neoplasia que ele teve?
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    onChange={handleCancerTypeChange}
                    className="dfm-select"
                  />
                </label>

                {motherCancerDetails.map((cancerDetail, index) => (
                  <label key={index} className="dfm-label">
                    <div className="dfm-idade">
                      <span>
                        Idade do diagnóstico para ({cancerDetail.type.label})
                        {cancerDetail.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={[
                              ...ageOptions,
                              { value: "nao_sei", label: "Não sei" }, // Adiciona a opção "Não sei"
                            ]}
                            value={
                              cancerDetail.age
                                ? {
                                    value: cancerDetail.age,
                                    label: cancerDetail.age,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              handleAgeChange(index, selectedOption.label);
                            }}
                            className="dfm-select"
                          />
                        ) : (
                          <input
                            type="number"
                            value={cancerDetail.age}
                            onChange={(e) =>
                              handleAgeChange(index, e.target.value)
                            }
                            className="dfm-input"
                          />
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAgeInput(index)}
                        className="dfm-toggle-button"
                      >
                        {cancerDetail.showAgeDropdown
                          ? "Digitar idade"
                          : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        } // Alterna o tooltip ao clicar
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
                    </div>
                  </label>
                ))}
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
                  Quantidade de tios
                  <input
                    type="number"
                    value={uncleAuntQuantities.tios}
                    onChange={(e) => {
                      if (validateAge(e.target.value)) {
                        setUncleAuntQuantities((prev) => ({
                          ...prev,
                          tios: e.target.value,
                        }));
                      }
                    }}
                    className="dfm-input"
                  />
                </label>
                <label className="dfm-label">
                  Quantidade de tias
                  <input
                    type="number"
                    value={uncleAuntQuantities.tias}
                    onChange={(e) => {
                      if (validateAge(e.target.value)) {
                        setUncleAuntQuantities((prev) => ({
                          ...prev,
                          tias: e.target.value,
                        }));
                      }
                    }}
                    className="dfm-input"
                  />
                </label>

                <label className="dfm-label">
                  Algum deles teve câncer ou neoplasia?
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
                        {/* Relation Select Dropdown */}
                        <label>
                          Parentesco
                          <Select
                            placeholder="Selecione o parentesco"
                            value={detail.parentesco}
                            options={[
                              { value: "tio", label: "Tio" },
                              { value: "tia", label: "Tia" },
                            ]}
                            onChange={(selectedOption) =>
                              handleRelationChange(index, selectedOption.value)
                            }
                            className="dfm-select"
                          />
                        </label>

                        {/* Cancer Type Select Dropdown */}
                        <label>
                          Selecione o tipo de câncer ou neoplasia
                          <Select
                            placeholder="Selecione o tipo de câncer"
                            isMulti
                            options={cancerOptions}
                            value={detail.type}
                            onChange={(selectedOption) => {
                              setUncleAuntCancerDetails((prev) =>
                                prev.map((d, i) =>
                                  i === index
                                    ? { ...d, type: selectedOption }
                                    : d
                                )
                              );
                            }}
                            className="dfm-select"
                          />
                        </label>

                        {detail.type &&
                          detail.type.map((cancerType) => (
                            <div key={cancerType.value} className="dfm-idade">
                              <span>
                                Idade do diagnóstico para ({cancerType.label})
                                {showAgeDropdowns[index + 1] ? (
                                  <Select
                                    placeholder="Selecione a idade"
                                    options={ageOptions}
                                    value={detail.age}
                                    onChange={(selectedOption) => {
                                      setUncleAuntCancerDetails((prev) =>
                                        prev.map((d, i) =>
                                          i === index
                                            ? {
                                                ...d,
                                                age: selectedOption.value,
                                              }
                                            : d
                                        )
                                      );
                                    }}
                                    className="dfm-select"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    value={detail.age}
                                    onChange={(e) => {
                                      if (validateAge(e.target.value)) {
                                        setUncleAuntCancerDetails((prev) =>
                                          prev.map((d, i) =>
                                            i === index
                                              ? { ...d, age: e.target.value }
                                              : d
                                          )
                                        );
                                      }
                                    }}
                                    className="dfm-input"
                                  />
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAgeToggle(index + 1)}
                                className="dfm-toggle-button"
                              >
                                {showAgeDropdowns[index + 1]
                                  ? "Digitar idade"
                                  : "Não sei"}
                              </button>
                              <img
                                src={InfoIcon}
                                alt="Info"
                                className="info-icon-idade"
                                onClick={() =>
                                  setTooltipIndex(
                                    index === tooltipIndex ? null : index
                                  )
                                }
                              />
                              {tooltipIndex === index && (
                                <div className="tooltip-idade">
                                  Caso seu paciente não saiba a idade exata do
                                  diagnóstico de câncer em um familiar,
                                  questione se foi antes ou depois dos 50 anos.
                                  Essa estimativa é mais fácil de lembrar e
                                  ainda oferece um corte de idade útil para a
                                  avaliação de risco.
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCancerDetail}
                      className="nn-btn-add"
                    >
                      Informar +
                    </button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

DadosFamiliaMaterna2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    noKnowledge: PropTypes.bool,
    mae: PropTypes.shape({
      teveCancer: PropTypes.bool,
      outroCancerList: PropTypes.arrayOf(
        PropTypes.shape({
          idadeDiagnostico: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          tipoCancer: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              value: PropTypes.string,
              label: PropTypes.string,
            }),
          ]),
        })
      ),
    }),
    tiosListMaterno: PropTypes.arrayOf(
      PropTypes.shape({
        teveCancer: PropTypes.bool,
        ladoParterno: PropTypes.string,
        sexo: PropTypes.string,
        outroCancerList: PropTypes.arrayOf(
          PropTypes.shape({
            idadeDiagnostico: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
            ]),
            tipoCancer: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
              }),
            ]),
          })
        ),
      })
    ),
  }),
};
