"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";

export default function DadosFamiliaMaterna2({
  onFormChange,
  initialData = {},
}) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(() => {
    const stored = localStorage.getItem("dfm2_noKnowledge");
    return stored ? JSON.parse(stored) : initialData?.noKnowledge || false;
  });
  const [motherHadCancer, setMotherHadCancer] = useState(() => {
    const stored = localStorage.getItem("dfm2_motherHadCancer");
    return stored ? JSON.parse(stored) : initialData?.mae?.teveCancer || false;
  });
  const [motherCancerDetails, setMotherCancerDetails] = useState(() => {
    const stored = localStorage.getItem("dfm2_motherCancerDetails");
    return stored
      ? JSON.parse(stored)
      : initialData?.mae?.outroCancerList || [];
  });
  const [hasMaternalUnclesAunts, setHasMaternalUnclesAunts] = useState(() => {
    const stored = localStorage.getItem("dfm2_hasMaternalUnclesAunts");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListMaterno?.length > 0 || false;
  });
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState(() => {
    const stored = localStorage.getItem("dfm2_uncleAuntQuantities");
    return stored
      ? JSON.parse(stored)
      : {
          tios:
            initialData?.tiosListMaterno?.filter(
              (item) => item.sexo === "masculino"
            ).length || "",
          tias:
            initialData?.tiosListMaterno?.filter(
              (item) => item.sexo === "feminino"
            ).length || "",
        };
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(() => {
    const stored = localStorage.getItem("dfm2_uncleAuntCancer");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListMaterno?.some((item) => item.teveCancer) || false;
  });
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState(() => {
    const stored = localStorage.getItem("dfm2_uncleAuntCancerDetails");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListMaterno?.map((tio) => ({
          type: tio.outroCancerList.map((cancer) => ({
            value: cancer.tipoCancer,
            label: cancer.tipoCancer,
            age: cancer.idadeDiagnostico || "",
            showAgeDropdown: false,
          })),
          parentesco:
            tio.sexo === "masculino"
              ? { value: "tio", label: "Tio" }
              : { value: "tia", label: "Tia" },
        })) || [];
  });

  const handleRelationChange = (index, selectedRelation) => {
    const updatedDetails = uncleAuntCancerDetails.map((d, i) =>
      i === index ? { ...d, parentesco: selectedRelation } : d
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfm2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleCancerTypeChange = (selectedOption) => {
    const newCancerDetails = selectedOption.map((option) => ({
      ...option,
      age: "",
      showAgeDropdown: false,
    }));
    setMotherCancerDetails(newCancerDetails);
    localStorage.setItem(
      "dfm2_motherCancerDetails",
      JSON.stringify(newCancerDetails)
    );
  };

  const handleAgeChange = (index, value) => {
    const updatedCancerDetails = motherCancerDetails.map((detail, i) =>
      i === index ? { ...detail, age: value } : detail
    );
    setMotherCancerDetails(updatedCancerDetails);
    localStorage.setItem(
      "dfm2_motherCancerDetails",
      JSON.stringify(updatedCancerDetails)
    );
  };

  const toggleAgeInput = (index) => {
    const updatedCancerDetails = motherCancerDetails.map((detail, i) =>
      i === index
        ? { ...detail, showAgeDropdown: !detail.showAgeDropdown }
        : detail
    );
    setMotherCancerDetails(updatedCancerDetails);
    localStorage.setItem(
      "dfm2_motherCancerDetails",
      JSON.stringify(updatedCancerDetails)
    );
  };

  useEffect(() => {
    const updatedUserData = {
      ...initialData,
      mae: {
        id: 0,
        teveCancer: motherHadCancer,
        outroCancerList: motherCancerDetails.map((cancerDetail) => ({
          idadeDiagnostico: cancerDetail.age || 0,
          tipoCancer: cancerDetail.value || "string",
        })),
      },
      tiosListMaterno: hasMaternalUnclesAunts
        ? uncleAuntCancerDetails.map((detail, index) => ({
            id: index,
            temTios: true,
            qtdTios: uncleAuntQuantities.tios,
            teveCancer: uncleAuntCancer,
            qtdTiosCancer: uncleAuntCancer ? uncleAuntCancerDetails.length : 0,
            ladoMaterno: "materno",
            sexo: detail.parentesco.value === "tio" ? "masculino" : "feminino",
            outroCancerList: detail.type.map((cancer) => ({
              id: index,
              idadeDiagnostico: cancer.age || 0,
              tipoCancer: cancer.value,
            })),
          }))
        : [
            {
              id: 0,
              temTios: false,
              qtdTios: 0,
              teveCancer: false,
              qtdTiosCancer: 0,
              ladoMaterno: "materno",
              sexo: "",
              outroCancerList: [],
            },
          ],
    };
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
    const updatedValue = !noKnowledge;
    setNoKnowledge(updatedValue);
    localStorage.setItem("dfm2_noKnowledge", JSON.stringify(updatedValue));
  };

  const handleMotherHadCancerChange = (value) => {
    const updatedValue = value === "sim";
    setMotherHadCancer(updatedValue);
    localStorage.setItem("dfm2_motherHadCancer", JSON.stringify(updatedValue));
  };

  const handleUncleAuntCancerChange = (value) => {
    const updatedValue = value === "sim";
    setUncleAuntCancer(updatedValue);
    localStorage.setItem("dfm2_uncleAuntCancer", JSON.stringify(updatedValue));
  };

  const handleAddCancerDetail = () => {
    const updatedDetails = [
      ...uncleAuntCancerDetails,
      { type: [], parentesco: { value: "tio", label: "Tio" } },
    ];
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfm2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const validateAge = (value) => {
    return value >= 0 || value === "";
  };

  const handleUncleAuntCancerTypeChange = (index, selectedOptions) => {
    const updatedDetails = uncleAuntCancerDetails.map((detail, i) =>
      i === index
        ? {
            ...detail,
            type: selectedOptions.map((option) => ({
              ...option,
              age: "",
              showAgeDropdown: false,
            })),
          }
        : detail
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfm2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleUncleAuntAgeChange = (detailIndex, cancerIndex, value) => {
    const updatedDetails = uncleAuntCancerDetails.map((detail, i) =>
      i === detailIndex
        ? {
            ...detail,
            type: detail.type.map((cancer, j) =>
              j === cancerIndex ? { ...cancer, age: value } : cancer
            ),
          }
        : detail
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfm2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const toggleUncleAuntAgeInput = (detailIndex, cancerIndex) => {
    const updatedDetails = uncleAuntCancerDetails.map((detail, i) =>
      i === detailIndex
        ? {
            ...detail,
            type: detail.type.map((cancer, j) =>
              j === cancerIndex
                ? { ...cancer, showAgeDropdown: !cancer.showAgeDropdown }
                : cancer
            ),
          }
        : detail
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfm2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

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
          Não tenho conhecimento da saúde e família da minha mãe biológica.
        </label>

        {!noKnowledge && (
          <>
            <label className="dfm-label">
              A mãe do Sr(a) já teve câncer ou neoplasia?
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
                  Qual foi o tipo de câncer ou neoplasia que ela teve?
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={motherCancerDetails}
                    onChange={handleCancerTypeChange}
                    className="dfm-select"
                  />
                </label>

                {motherCancerDetails.map((cancerDetail, index) => (
                  <label key={index} className="dfm-label">
                    <div className="dfm-idade">
                      <span>
                        Idade do diagnóstico para ({cancerDetail.label})
                        {cancerDetail.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione a idade"
                            options={[
                              ...ageOptions,
                              { value: "nao_sei", label: "Não sei" },
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
                    onChange={() => {
                      setHasMaternalUnclesAunts(true);
                      localStorage.setItem(
                        "dfm2_hasMaternalUnclesAunts",
                        JSON.stringify(true)
                      );
                    }}
                    className="dfm-checkbox"
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="não"
                    checked={hasMaternalUnclesAunts === false}
                    onChange={() => {
                      setHasMaternalUnclesAunts(false);
                      localStorage.setItem(
                        "dfm2_hasMaternalUnclesAunts",
                        JSON.stringify(false)
                      );
                    }}
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
                        const updatedQuantities = {
                          ...uncleAuntQuantities,
                          tios: e.target.value,
                        };
                        setUncleAuntQuantities(updatedQuantities);
                        localStorage.setItem(
                          "dfm2_uncleAuntQuantities",
                          JSON.stringify(updatedQuantities)
                        );
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
                        const updatedQuantities = {
                          ...uncleAuntQuantities,
                          tias: e.target.value,
                        };
                        setUncleAuntQuantities(updatedQuantities);
                        localStorage.setItem(
                          "dfm2_uncleAuntQuantities",
                          JSON.stringify(updatedQuantities)
                        );
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
                    {uncleAuntCancerDetails.map((detail, detailIndex) => (
                      <div key={detailIndex} className="dfm-cancer-detail">
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
                              handleRelationChange(detailIndex, selectedOption)
                            }
                            className="dfm-select"
                          />
                        </label>

                        <label>
                          Selecione o tipo de câncer ou neoplasia
                          <Select
                            placeholder="Selecione o tipo de câncer"
                            isMulti
                            options={cancerOptions}
                            value={detail.type}
                            onChange={(selectedOption) =>
                              handleUncleAuntCancerTypeChange(
                                detailIndex,
                                selectedOption
                              )
                            }
                            className="dfm-select"
                          />
                        </label>

                        {detail.type.map((cancerType, cancerIndex) => (
                          <div key={cancerIndex} className="dfm-idade">
                            <span>
                              Idade do diagnóstico para ({cancerType.label})
                              {cancerType.showAgeDropdown ? (
                                <Select
                                  placeholder="Selecione a idade"
                                  options={ageOptions}
                                  value={
                                    cancerType.age
                                      ? {
                                          value: cancerType.age,
                                          label: cancerType.age,
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) => {
                                    handleUncleAuntAgeChange(
                                      detailIndex,
                                      cancerIndex,
                                      selectedOption.value
                                    );
                                  }}
                                  className="dfm-select"
                                />
                              ) : (
                                <input
                                  type="number"
                                  value={cancerType.age}
                                  onChange={(e) => {
                                    if (validateAge(e.target.value)) {
                                      handleUncleAuntAgeChange(
                                        detailIndex,
                                        cancerIndex,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  className="dfm-input"
                                />
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                toggleUncleAuntAgeInput(
                                  detailIndex,
                                  cancerIndex
                                )
                              }
                              className="dfm-toggle-button"
                            >
                              {cancerType.showAgeDropdown
                                ? "Digitar idade"
                                : "Não sei"}
                            </button>
                            <img
                              src={InfoIcon}
                              alt="Info"
                              className="info-icon-idade"
                              onClick={() =>
                                setTooltipIndex(
                                  tooltipIndex ===
                                    `${detailIndex}-${cancerIndex}`
                                    ? null
                                    : `${detailIndex}-${cancerIndex}`
                                )
                              }
                            />
                            {tooltipIndex ===
                              `${detailIndex}-${cancerIndex}` && (
                              <div className="tooltip-idade">
                                Caso seu paciente não saiba a idade exata do
                                diagnóstico de câncer em um familiar, questione
                                se foi antes ou depois dos 50 anos. Essa
                                estimativa é mais fácil de lembrar e ainda
                                oferece um corte de idade útil para a avaliação
                                de risco.
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
        ladoMaterno: PropTypes.string,
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
