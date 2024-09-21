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
    })) || [{ type: null, parentesco: "", age: "" }]
  );
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]);

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
                    isMulti
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
                          onChange={(e) => {
                            if (validateAge(e.target.value)) {
                              setMotherCancerDetails((prev) => ({
                                ...prev,
                                age: e.target.value,
                              }));
                            }
                          }}
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
                          placeholder="Selecione o tipo de câncer"
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

DadosFamiliaMaterna2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};


DadosFamiliaMaterna2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    noKnowledge: PropTypes.bool,
    mae: PropTypes.shape({
      teveCancer: PropTypes.bool,
      outroCancerList: PropTypes.arrayOf(
        PropTypes.shape({
          idadeDiagnostico: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
            idadeDiagnostico: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
