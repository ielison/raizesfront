import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./DadosFamiliaMaterna2.css";

export default function DadosFamiliaMaterna2({ onFormChange, initialData }) {
  const [noKnowledge, setNoKnowledge] = useState(
    initialData?.noKnowledge || false
  );
  const [motherHadCancer, setMotherHadCancer] = useState(
    initialData?.mae?.teveCancer || false
  );
  const [motherCancerDetails, setMotherCancerDetails] = useState({
    type: initialData?.mae?.outroCancerList[0]?.tipoCancer || null,
    age: initialData?.mae?.outroCancerList[0]?.idadeDiagnostico || "",
  });
  const [hasMaternalUnclesAunts, setHasMaternalUnclesAunts] = useState(
    initialData?.tiosList?.length > 0 || false
  );
  const [uncleAuntQuantities, setUncleAuntQuantities] = useState({
    tios:
      initialData?.tiosList?.filter((item) => item.sexo === "masculino")
        .length || "",
    tias:
      initialData?.tiosList?.filter((item) => item.sexo === "feminino")
        .length || "",
  });
  const [uncleAuntCancer, setUncleAuntCancer] = useState(
    initialData?.tiosList?.some((item) => item.teveCancer) || false
  );
  const [uncleAuntCancerDetails, setUncleAuntCancerDetails] = useState(
    // eslint-disable-next-line no-unused-vars
    initialData?.tiosList?.map((tio, index) => ({
      type: tio.outroCancerList[0]?.tipoCancer || [],
      parentesco: tio.sexo === "masculino" ? "tio" : "tia",
      age: tio.outroCancerList[0]?.idadeDiagnostico || "",
    })) || [{ type: [], parentesco: "", age: "" }]
  );
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]);

  useEffect(() => {
    const updatedUserData = {
      mae: {
        id: 0,
        teveCancer: motherHadCancer,
        outroCancerList: [
          {
            id: 0,
            idadeDiagnostico: motherCancerDetails.age,
            tipoCancer: motherCancerDetails.type?.value || "string",
          },
        ],
      },
      tiosList: hasMaternalUnclesAunts
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
                tipoCancer: detail.type?.value || "string",
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
      { type: [], parentesco: "", age: "" },
    ]);
    setShowAgeDropdowns([...showAgeDropdowns, false]);
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
              A mãe do Sr(a) já teve câncer?
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
                  Qual foi o tipo de câncer que ela teve?
                  <Select
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={motherCancerDetails.type}
                    onChange={(selectedOption) => {
                      setMotherCancerDetails((prev) => ({
                        ...prev,
                        type: selectedOption,
                      }));
                    }}
                    className="dfm-select"
                  />
                </label>

                <label className="dfm-label">
                  <div className="dfm-idade">
                    <span>
                      Idade
                      {showAgeDropdowns[0] ? (
                        <Select
                          placeholder="Selecione a idade"
                          options={ageOptions}
                          value={motherCancerDetails.age}
                          onChange={(selectedOption) => {
                            setMotherCancerDetails((prev) => ({
                              ...prev,
                              age: selectedOption,
                            }));
                          }}
                          className="dfm-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={motherCancerDetails.age}
                          onChange={(e) =>
                            setMotherCancerDetails((prev) => ({
                              ...prev,
                              age: e.target.value,
                            }))
                          }
                          className="dfm-input"
                        />
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAgeToggle(0)}
                      className="dfm-toggle-button"
                    >
                      {showAgeDropdowns[0] ? "Digitar idade" : "Não sei"}
                    </button>
                  </div>
                </label>
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
                    className="dfm-input"
                  />
                </label>

                <label className="dfm-label">
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
                    className="dfm-input"
                  />
                </label>

                <label className="dfm-label">
                  Algum deles já teve câncer?
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
                      <div key={index} className="dfm-details">
                        <label className="dfm-label">
                          Tipo de câncer para {detail.parentesco}
                          <Select
                            placeholder="Selecione o tipo de câncer"
                            options={cancerOptions}
                            value={detail.type}
                            onChange={(selectedOption) => {
                              const updatedDetails = [
                                ...uncleAuntCancerDetails,
                              ];
                              updatedDetails[index].type = selectedOption;
                              setUncleAuntCancerDetails(updatedDetails);
                            }}
                            className="dfm-select"
                          />
                        </label>

                        <label className="dfm-label">
                          <div className="dfm-idade">
                            <span>
                              Idade
                              {showAgeDropdowns[index + 1] ? (
                                <Select
                                  placeholder="Selecione a idade"
                                  options={ageOptions}
                                  value={detail.age}
                                  onChange={(selectedOption) => {
                                    const updatedDetails = [
                                      ...uncleAuntCancerDetails,
                                    ];
                                    updatedDetails[index].age = selectedOption;
                                    setUncleAuntCancerDetails(updatedDetails);
                                  }}
                                  className="dfm-select"
                                />
                              ) : (
                                <input
                                  type="number"
                                  value={detail.age}
                                  onChange={(e) => {
                                    const updatedDetails = [
                                      ...uncleAuntCancerDetails,
                                    ];
                                    updatedDetails[index].age = e.target.value;
                                    setUncleAuntCancerDetails(updatedDetails);
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
                          </div>
                        </label>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddCancerDetail}
                      className="dfm-add-button"
                    >
                      Adicionar outro câncer
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
          tipoCancer: PropTypes.object,
          idadeDiagnostico: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
        })
      ),
    }),
    tiosList: PropTypes.arrayOf(
      PropTypes.shape({
        teveCancer: PropTypes.bool,
        sexo: PropTypes.string,
        outroCancerList: PropTypes.arrayOf(
          PropTypes.shape({
            tipoCancer: PropTypes.object,
            idadeDiagnostico: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
            ]),
          })
        ),
      })
    ),
  }),
};
