import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import "./DadosFamiliaPaterna2.css";

export default function DadosFamiliaPaterna2({ onFormChange, initialData }) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(
    initialData?.noKnowledge || false
  );
  const [fatherHadCancer, setFatherHadCancer] = useState(
    initialData?.pai?.teveCancer || false
  );
  const [fatherCancerDetails, setFatherCancerDetails] = useState(
    initialData?.pai?.outroCancerList || []
  );
  const [hasPaternalUnclesAunts, setHasPaternalUnclesAunts] = useState(
    initialData?.tiosListPaterno?.length > 0 || false
  );
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState({
    tios:
      initialData?.tiosListPaterno?.filter((item) => item.sexo === "masculino")
        .length || "",
    tias:
      initialData?.tiosListPaterno?.filter((item) => item.sexo === "feminino")
        .length || "",
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(
    initialData?.tiosListPaterno?.some((item) => item.teveCancer) || false
  );
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState(
    initialData?.tiosListPaterno?.map((tio) => ({
      type: tio.outroCancerList[0]?.tipoCancer || null,
      parentesco: tio.sexo === "masculino" ? "tio" : "tia",
      age: tio.outroCancerList[0]?.idadeDiagnostico || "",
    })) || [{ type: null, parentesco: "", age: "" }]
  );
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]);

  const handleCancerTypeChange = (selectedOption) => {
    // Adiciona tipos de câncer ao estado
    const newCancerDetails = selectedOption.map((option) => ({
      type: option,
      age: "", // Inicializa a idade como vazia
      showAgeDropdown: true, // Inicializa a idade como vazia
    }));

    setFatherCancerDetails(newCancerDetails);
  };

  const handleAgeChange = (index, value) => {
    const updatedCancerDetails = [...fatherCancerDetails];
    updatedCancerDetails[index].age = value;
    setFatherCancerDetails(updatedCancerDetails);
  };

  const toggleAgeInput = (index) => {
    const updatedCancerDetails = [...fatherCancerDetails];
    updatedCancerDetails[index].showAgeDropdown =
      !updatedCancerDetails[index].showAgeDropdown;
    setFatherCancerDetails(updatedCancerDetails);
  };

  useEffect(() => {
    console.log("Valores antes da atualização:", {
      fatherHadCancer,
      fatherCancerDetails,
      hasPaternalUnclesAunts,
      uncleAuntQuantities,
      uncleAuntCancer,
      uncleAuntCancerDetails,
    });

    const updatedUserData = {
      pai: {
        id: 0,
        teveCancer: fatherHadCancer,
        outroCancerList: fatherCancerDetails.map((cancerDetail) => ({
          idadeDiagnostico: cancerDetail.age || 0,
          tipoCancer: cancerDetail.type?.value || "string",
        })),
      },
      tiosListPaterno: hasPaternalUnclesAunts
        ? uncleAuntCancerDetails.map((detail, index) => ({
            id: index,
            temTios: true,
            qtdTios: uncleAuntQuantities.tios,
            teveCancer: uncleAuntCancer,
            qtdTiosCancer: uncleAuntCancer ? uncleAuntCancerDetails.length : 0,
            ladoParterno: "paterno",
            sexo: detail.parentesco === "tio" ? "masculino" : "feminino",
            outroCancerList: [
              {
                id: index,
                idadeDiagnostico: detail.age || 0,
                tipoCancer: detail.type?.value || "string",
              },
            ],
          }))
        : [],
    };

    console.log("User Data Updated:", updatedUserData);
    onFormChange(updatedUserData);
  }, [
    fatherHadCancer,
    fatherCancerDetails,
    hasPaternalUnclesAunts,
    uncleAuntQuantities,
    uncleAuntCancer,
    uncleAuntCancerDetails,
    onFormChange,
  ]);

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
      { type: null, parentesco: "", age: "" },
    ]);
    setShowAgeDropdowns([...showAgeDropdowns, false]);
  };

  const validateAge = (value) => {
    // Ensure age is a non-negative number or an empty string
    return value >= 0 || value === "";
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
              O pai do Sr(a) já teve câncer?
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
                  Qual foi o tipo de câncer ou neoplasia que ela teve?
                  <Select
                    isMulti
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    onChange={handleCancerTypeChange}
                    className="dfm-select"
                  />
                </label>

                {fatherCancerDetails.map((cancerDetail, index) => (
                  <label key={index} className="dfm-label">
                    <div className="dfm-idade">
                      <span>
                        Idade do diagnóstico para {cancerDetail.type.label}:
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
              O Sr(a) tem tios e tias por parte de pai?
              <div className="dfm-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="sim"
                    checked={hasPaternalUnclesAunts === true}
                    onChange={() => setHasPaternalUnclesAunts(true)}
                    className="dfm-checkbox"
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="não"
                    checked={hasPaternalUnclesAunts === false}
                    onChange={() => setHasPaternalUnclesAunts(false)}
                    className="dfm-checkbox"
                  />
                  Não
                </label>
              </div>
            </label>

            {hasPaternalUnclesAunts && (
              <>
                <label className="dfm-label">
                  Quantos tios?
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
                  Quantas tias?
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
                  Algum deles teve câncer?
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
                        <Select
                          isMulti
                          placeholder="Selecione o tipo de câncer"
                          options={cancerOptions}
                          value={detail.type}
                          onChange={(selectedOption) => {
                            setUncleAuntCancerDetails((prev) =>
                              prev.map((d, i) =>
                                i === index ? { ...d, type: selectedOption } : d
                              )
                            );
                          }}
                          className="dfm-select"
                        />
                        <div className="dfm-idade">
                          <span>
                            Idade
                            {showAgeDropdowns[index + 1] ? (
                              <Select
                                placeholder="Selecione a idade"
                                options={ageOptions}
                                value={detail.age}
                                onChange={(selectedOption) => {
                                  setUncleAuntCancerDetails((prev) =>
                                    prev.map((d, i) =>
                                      i === index
                                        ? { ...d, age: selectedOption }
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
                            } // Alterna o tooltip ao clicar
                          />
                          {tooltipIndex === index && (
                            <div className="tooltip-idade">
                              Caso seu paciente não saiba a idade exata do
                              diagnóstico de câncer em um familiar, questione se
                              foi antes ou depois dos 50 anos. Essa estimativa é
                              mais fácil de lembrar e ainda oferece um corte de
                              idade útil para a avaliação de risco.
                            </div>
                          )}
                        </div>
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
  initialData: PropTypes.object,
};

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
