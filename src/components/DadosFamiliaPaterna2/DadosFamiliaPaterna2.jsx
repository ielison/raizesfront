
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import './DadosFamiliaPaterna2.css'

export default function DadosFamiliaPaterna2({
  onFormChange,
  initialData = {},
}) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(() => {
    const stored = localStorage.getItem("dfp2_noKnowledge");
    return stored ? JSON.parse(stored) : initialData?.noKnowledge || false;
  });
  const [fatherHadCancer, setFatherHadCancer] = useState(() => {
    const stored = localStorage.getItem("dfp2_fatherHadCancer");
    return stored ? JSON.parse(stored) : initialData?.pai?.teveCancer || false;
  });
  const [fatherCancerDetails, setFatherCancerDetails] = useState(() => {
    const stored = localStorage.getItem("dfp2_fatherCancerDetails");
    return stored
      ? JSON.parse(stored)
      : initialData?.pai?.outroCancerList || [];
  });
  const [hasPaternalUnclesAunts, setHasPaternalUnclesAunts] = useState(() => {
    const stored = localStorage.getItem("dfp2_hasPaternalUnclesAunts");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListPaterno?.length > 0 || false;
  });
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState(() => {
    const stored = localStorage.getItem("dfp2_uncleAuntQuantities");
    return stored
      ? JSON.parse(stored)
      : {
          tios:
            initialData?.tiosListPaterno?.filter(
              (item) => item.sexo === "masculino"
            ).length || "",
          tias:
            initialData?.tiosListPaterno?.filter(
              (item) => item.sexo === "feminino"
            ).length || "",
        };
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(() => {
    const stored = localStorage.getItem("dfp2_uncleAuntCancer");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListPaterno?.some((item) => item.teveCancer) || false;
  });

  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState(() => {
    const stored = localStorage.getItem("dfp2_uncleAuntCancerDetails");
    return stored
      ? JSON.parse(stored)
      : initialData?.tiosListPaterno?.map((tio) => ({
          type: tio.outroCancerList.map((cancer) => ({
            value: cancer.tipoCancer,
            label: cancer.tipoCancer,
            age: cancer.idadeDiagnostico || "",
            showAgeDropdown: false,
          })),
          parentesco: null,
        })) || [];
  });

  const handleRelationChange = (index, selectedRelation) => {
    const updatedDetails = uncleAuntCancerDetails.map((d, i) =>
      i === index ? { ...d, parentesco: selectedRelation } : d
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfp2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleDeleteFatherCancer = (indexToDelete) => {
    const updatedCancerDetails = fatherCancerDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setFatherCancerDetails(updatedCancerDetails);
    localStorage.setItem(
      "dfp2_fatherCancerDetails",
      JSON.stringify(updatedCancerDetails)
    );
  };

  const handleDeleteUncleAunt = (indexToDelete) => {
    const updatedDetails = uncleAuntCancerDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfp2_uncleAuntCancerDetails",
      JSON.stringify(updatedDetails)
    );
  };

  const handleCancerTypeChange = (selectedOption) => {
    const newCancerDetails = selectedOption.map((option) => ({
      ...option,
      age: "",
      showAgeDropdown: false,
    }));
    setFatherCancerDetails(newCancerDetails);
    localStorage.setItem(
      "dfp2_fatherCancerDetails",
      JSON.stringify(newCancerDetails)
    );
  };

  const handleAgeChange = (index, value) => {
    const updatedCancerDetails = fatherCancerDetails.map((detail, i) =>
      i === index ? { ...detail, age: value } : detail
    );
    setFatherCancerDetails(updatedCancerDetails);
    localStorage.setItem(
      "dfp2_fatherCancerDetails",
      JSON.stringify(updatedCancerDetails)
    );
  };

  const toggleAgeInput = (index) => {
    const updatedCancerDetails = fatherCancerDetails.map((detail, i) =>
      i === index
        ? { ...detail, showAgeDropdown: !detail.showAgeDropdown }
        : detail
    );
    setFatherCancerDetails(updatedCancerDetails);
    localStorage.setItem(
      "dfp2_fatherCancerDetails",
      JSON.stringify(updatedCancerDetails)
    );
  };

  useEffect(() => {
    const updatedUserData = {
      ...initialData,
      pai: {
        id: 0,
        teveCancer: fatherHadCancer,
        outroCancerList: fatherCancerDetails.map((cancerDetail) => ({
          idadeDiagnostico: cancerDetail.age || 0,
          tipoCancer: cancerDetail.value || "string",
        })),
      },
      tiosListPaterno: hasPaternalUnclesAunts
        ? uncleAuntCancerDetails.map((detail, index) => ({
            id: index,
            temTios: true,
            qtdTios: uncleAuntQuantities.tios,
            teveCancer: uncleAuntCancer,
            qtdTiosCancer: uncleAuntCancer ? uncleAuntCancerDetails.length : 0,
            ladoPaterno: "paterno",
            sexo: detail.parentesco
              ? detail.parentesco.value === "tio"
                ? "masculino"
                : "feminino"
              : "",
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
              ladoPaterno: "paterno",
              sexo: "",
              outroCancerList: [],
            },
          ],
    };
    onFormChange(updatedUserData);
  }, [
    fatherHadCancer,
    fatherCancerDetails,
    hasPaternalUnclesAunts,
    uncleAuntQuantities,
    uncleAuntCancer,
    uncleAuntCancerDetails,
    onFormChange,
    initialData,
  ]);

  const handleNoKnowledgeChange = () => {
    const updatedValue = !noKnowledge;
    setNoKnowledge(updatedValue);
    localStorage.setItem("dfp2_noKnowledge", JSON.stringify(updatedValue));
  };

  const handleFatherHadCancerChange = (value) => {
    const updatedValue = value === "sim";
    setFatherHadCancer(updatedValue);
    localStorage.setItem("dfp2_fatherHadCancer", JSON.stringify(updatedValue));
  };

  const handleUncleAuntCancerChange = (value) => {
    const updatedValue = value === "sim";
    setUncleAuntCancer(updatedValue);
    localStorage.setItem("dfp2_uncleAuntCancer", JSON.stringify(updatedValue));
  };

  const handleAddCancerDetail = () => {
    const updatedDetails = [
      ...uncleAuntCancerDetails,
      { type: [], parentesco: null },
    ];
    setUncleAuntCancerDetails(updatedDetails);
    localStorage.setItem(
      "dfp2_uncleAuntCancerDetails",
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
      "dfp2_uncleAuntCancerDetails",
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
      "dfp2_uncleAuntCancerDetails",
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
      "dfp2_uncleAuntCancerDetails",
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
          Não tenho conhecimento da saúde e família do meu pai biológico.
        </label>

        {!noKnowledge && (
          <>
            <label className="dfm-label">
              O pai do Sr(a) já teve câncer ou neoplasia?
              <div className="dfm-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="sim"
                    checked={fatherHadCancer === true}
                    onChange={() => handleFatherHadCancerChange("sim")}
                    className="dfm-checkbox"
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="não"
                    checked={fatherHadCancer === false}
                    onChange={() => handleFatherHadCancerChange("não")}
                    className="dfm-checkbox"
                  />
                  Não
                </label>
              </div>
            </label>

            {fatherHadCancer && (
              <>
                <label className="dfm-label">
                  Qual foi o tipo de câncer ou neoplasia que ele teve?
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={fatherCancerDetails}
                    onChange={handleCancerTypeChange}
                    className="dfm-select"
                  />
                </label>

                {fatherCancerDetails.map((cancerDetail, index) => (
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
                    <button
                      className="dfm-btn-delete"
                      type="button"
                      onClick={() => handleDeleteFatherCancer(index)}
                    >
                      <img src={DeleteIcon} alt="Deletar" />
                    </button>
                  </div>
                ))}
              </>
            )}

            <label className="dfm-label">
              O Sr(a) tem tios e tias por parte de pai?
              <div className="dfm-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="sim"
                    checked={hasPaternalUnclesAunts === true}
                    onChange={() => {
                      setHasPaternalUnclesAunts(true);
                      localStorage.setItem(
                        "dfp2_hasPaternalUnclesAunts",
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
                    checked={hasPaternalUnclesAunts === false}
                    onChange={() => {
                      setHasPaternalUnclesAunts(false);
                      localStorage.setItem(
                        "dfp2_hasPaternalUnclesAunts",
                        JSON.stringify(false)
                      );
                    }}
                    className="dfm-checkbox"
                  />
                  Não
                </label>
              </div>
            </label>

            {hasPaternalUnclesAunts && (
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
                          "dfp2_uncleAuntQuantities",
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
                          "dfp2_uncleAuntQuantities",
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

DadosFamiliaPaterna2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    noKnowledge: PropTypes.bool,
    pai: PropTypes.shape({
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
    tiosListPaterno: PropTypes.arrayOf(
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
