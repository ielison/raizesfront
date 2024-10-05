"use client";

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import "./DadosFamiliaMaterna2.css";

export default function DadosFamiliaMaterna2({
  onFormChange,
  initialData = {},
}) {
  const [showTooltip, setShowTooltip] = useState(false);
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
          parentesco: null,
        })) || [];
  });

  const handleRelationChange = useCallback((index, selectedRelation) => {
    setUncleAuntCancerDetails((prevDetails) => {
      const updatedDetails = prevDetails.map((d, i) =>
        i === index ? { ...d, parentesco: selectedRelation } : d
      );
      localStorage.setItem(
        "dfm2_uncleAuntCancerDetails",
        JSON.stringify(updatedDetails)
      );
      return updatedDetails;
    });
  }, []);

  const handleDeleteMotherCancer = useCallback((indexToDelete) => {
    setMotherCancerDetails((prevDetails) => {
      const updatedCancerDetails = prevDetails.filter(
        (_, index) => index !== indexToDelete
      );
      localStorage.setItem(
        "dfm2_motherCancerDetails",
        JSON.stringify(updatedCancerDetails)
      );
      return updatedCancerDetails;
    });
  }, []);

  const handleDeleteUncleAunt = useCallback((indexToDelete) => {
    setUncleAuntCancerDetails((prevDetails) => {
      const updatedDetails = prevDetails.filter(
        (_, index) => index !== indexToDelete
      );
      localStorage.setItem(
        "dfm2_uncleAuntCancerDetails",
        JSON.stringify(updatedDetails)
      );
      return updatedDetails;
    });
  }, []);

  const handleCancerTypeChange = useCallback((selectedOptions) => {
    setMotherCancerDetails((prevDetails) => {
      const existingDetails = new Map(prevDetails.map((d) => [d.value, d]));
      const newCancerDetails = selectedOptions.map((option) => ({
        ...option,
        age: existingDetails.has(option.value)
          ? existingDetails.get(option.value).age
          : "",
        showAgeDropdown: existingDetails.has(option.value)
          ? existingDetails.get(option.value).showAgeDropdown
          : false,
      }));
      localStorage.setItem(
        "dfm2_motherCancerDetails",
        JSON.stringify(newCancerDetails)
      );
      return newCancerDetails;
    });
  }, []);

  const handleAgeChange = useCallback((index, value) => {
    setMotherCancerDetails((prevDetails) => {
      const updatedCancerDetails = prevDetails.map((detail, i) =>
        i === index ? { ...detail, age: value } : detail
      );
      localStorage.setItem(
        "dfm2_motherCancerDetails",
        JSON.stringify(updatedCancerDetails)
      );
      return updatedCancerDetails;
    });
  }, []);

  const toggleAgeInput = useCallback((index) => {
    setMotherCancerDetails((prevDetails) => {
      const updatedCancerDetails = prevDetails.map((detail, i) =>
        i === index
          ? { ...detail, showAgeDropdown: !detail.showAgeDropdown }
          : detail
      );
      localStorage.setItem(
        "dfm2_motherCancerDetails",
        JSON.stringify(updatedCancerDetails)
      );
      return updatedCancerDetails;
    });
  }, []);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  useEffect(() => {
    const updatedUserData = {
      ...initialData,
      mae: {
        id: 0,
        teveCancer: motherHadCancer,
        outroCancerList: motherCancerDetails.map((cancerDetail) => ({
          idadeDiagnostico: cancerDetail.age || 0,
          tipoCancer: cancerDetail.label || "string",
        })),
      },
      tiosListMaterno: hasMaternalUnclesAunts
        ? uncleAuntCancerDetails.map((detail, index) => ({
            id: index,
            temTios: true,
            qtdTios: uncleAuntQuantities.tios,
            teveCancer: uncleAuntCancer,
            qtdTiosCancer: uncleAuntCancer ? uncleAuntCancerDetails.length : 0,
            ladoPaterno: "materno",
            sexo: detail.parentesco
              ? detail.parentesco.value === "tio"
                ? "masculino"
                : "feminino"
              : "",
            outroCancerList: detail.type.map((cancer) => ({
              id: index,
              idadeDiagnostico: cancer.age || 0,
              tipoCancer: cancer.label,
            })),
          }))
        : [
            {
              id: 0,
              temTios: false,
              qtdTios: 0,
              teveCancer: false,
              qtdTiosCancer: 0,
              ladoPaterno: "materno",
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

  const handleNoKnowledgeChange = useCallback(() => {
    setNoKnowledge((prevValue) => {
      const updatedValue = !prevValue;
      localStorage.setItem("dfm2_noKnowledge", JSON.stringify(updatedValue));
      return updatedValue;
    });
  }, []);

  const handleMotherHadCancerChange = useCallback((value) => {
    const updatedValue = value === "sim";
    setMotherHadCancer(updatedValue);
    localStorage.setItem("dfm2_motherHadCancer", JSON.stringify(updatedValue));
  }, []);

  const handleUncleAuntCancerChange = useCallback((value) => {
    const updatedValue = value === "sim";
    setUncleAuntCancer(updatedValue);
    localStorage.setItem("dfm2_uncleAuntCancer", JSON.stringify(updatedValue));
  }, []);

  const handleAddCancerDetail = useCallback(() => {
    setUncleAuntCancerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails, { type: [], parentesco: null }];
      localStorage.setItem(
        "dfm2_uncleAuntCancerDetails",
        JSON.stringify(updatedDetails)
      );
      return updatedDetails;
    });
  }, []);

  const validateAge = useCallback((value) => {
    return value >= 0 || value === "";
  }, []);

  const handleUncleAuntCancerTypeChange = useCallback(
    (index, selectedOptions) => {
      setUncleAuntCancerDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((detail, i) => {
          if (i === index) {
            const existingTypes = new Map(detail.type.map((t) => [t.value, t]));
            return {
              ...detail,
              type: selectedOptions.map((option) => ({
                ...option,
                age: existingTypes.has(option.value)
                  ? existingTypes.get(option.value).age
                  : "",
                showAgeDropdown: existingTypes.has(option.value)
                  ? existingTypes.get(option.value).showAgeDropdown
                  : false,
              })),
            };
          }
          return detail;
        });
        localStorage.setItem(
          "dfm2_uncleAuntCancerDetails",
          JSON.stringify(updatedDetails)
        );
        return updatedDetails;
      });
    },
    []
  );
  const handleUncleAuntAgeChange = useCallback(
    (detailIndex, cancerIndex, value) => {
      setUncleAuntCancerDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((detail, i) =>
          i === detailIndex
            ? {
                ...detail,
                type: detail.type.map((cancer, j) =>
                  j === cancerIndex ? { ...cancer, age: value } : cancer
                ),
              }
            : detail
        );
        localStorage.setItem(
          "dfm2_uncleAuntCancerDetails",
          JSON.stringify(updatedDetails)
        );
        return updatedDetails;
      });
    },
    []
  );

  const toggleUncleAuntAgeInput = useCallback((detailIndex, cancerIndex) => {
    setUncleAuntCancerDetails((prevDetails) => {
      const updatedDetails = prevDetails.map((detail, i) =>
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
      localStorage.setItem(
        "dfm2_uncleAuntCancerDetails",
        JSON.stringify(updatedDetails)
      );
      return updatedDetails;
    });
  }, []);

  return (
    <div className="dfm-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="dfm-form-container">
        <div className="question-with-tooltip">
          <label className="dfm-label">
            <div className="top-tooltip">
              <div> </div>
              <div>
                <button
                  type="button"
                  className="info-button"
                  onClick={toggleTooltip}
                  aria-label="Informações adicionais"
                >
                  <img src={InfoIcon} alt="" className="info-icon" />
                </button>
                {showTooltip && (
                  <div className="tooltip" role="tooltip">
                    Caso seu paciente não saiba a idade exata do diagnóstico de
                    câncer em um familiar, questione se foi antes ou depois dos
                    50 anos. Essa estimativa é mais fácil de lembrar e ainda
                    oferece um corte de idade útil para a avaliação de risco.
                  </div>
                )}
              </div>
            </div>
          </label>
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
                  Qual foi o tipo de câncer ou neoplasia ela teve?
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
                  <div key={index} className="dfm-cancer-detail">
                    <label className="dfm-label">
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
                      </div>
                    </label>
                    <button
                      className="dfm-btn-delete"
                      type="button"
                      onClick={() => handleDeleteMotherCancer(index)}
                    >
                      <img src={DeleteIcon} alt="Deletar" />
                    </button>
                  </div>
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
                          </div>
                        ))}
                        <button
                          className="dfm-btn-delete"
                          type="button"
                          onClick={() => handleDeleteUncleAunt(detailIndex)}
                        >
                          <img src={DeleteIcon} alt="Deletar" />
                        </button>
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
        ladoPaterno: PropTypes.string,
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
