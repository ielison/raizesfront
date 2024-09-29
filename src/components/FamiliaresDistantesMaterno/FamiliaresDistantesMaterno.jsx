import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./FamiliaresDistantesMaterno.css";

const relationshipOptions = [
  { value: "meio-tio materno", label: "Meio-Tio Materno" },
  { value: "meia-tia materna", label: "Meia-Tia Materna" },
  { value: "meio-tio paterno", label: "Meio-Tio Paterno" },
  { value: "meia-tia paterna", label: "Meia-Tia Paterna" },
  { value: "tio-avô materno", label: "Tio-Avô Materno" },
  { value: "tia-avó materna", label: "Tia-Avó Materna" },
  { value: "tio-avô paterno", label: "Tio-Avô Paterno" },
  { value: "tia-avó paterna", label: "Tia-Avó Paterna" },
  { value: "prima materna 2o grau", label: "Prima Materna 2º Grau" },
  { value: "primo materno 2o grau", label: "Primo Materno 2º Grau" },
  { value: "prima paterna 2o grau", label: "Prima Paterna 2º Grau" },
  { value: "primo paterno 2o grau", label: "Primo Paterno 2º Grau" },
  { value: "prima materna 3o grau", label: "Prima Materna 3º Grau" },
  { value: "primo materno 3o grau", label: "Primo Materno 3º Grau" },
  { value: "prima paterna 3o grau", label: "Prima Paterna 3º Grau" },
  { value: "primo paterno 3o grau", label: "Primo Paterno 3º Grau" },
  { value: "bisavô materno", label: "Bisavô Materno" },
  { value: "bisavó materna", label: "Bisavó Materna" },
  { value: "bisavô paterno", label: "Bisavô Paterno" },
  { value: "bisavó paterna", label: "Bisavó Paterna" },
  { value: "bisneto", label: "Bisneto" },
  { value: "bisneta", label: "Bisneta" },
  { value: "outro", label: "Outro" },
];

export default function FamiliaresDistantesMaterno({
  onClose,
  onBack,
  onAdvance,
}) {
  const [distantesHadCancer, setDistantesHadCancer] = useState(null);
  const [distantesDetails, setDistantesDetails] = useState([
    {
      relationship: "",
      type: null,
      age: "",
      showAgeDropdown: false,
      customRelationship: "",
    },
  ]);

  const handleDistantesHadCancerChange = (value) => {
    setDistantesHadCancer(value);

    if (value === false) {
      setDistantesDetails([
        {
          relationship: "",
          type: null,
          age: "",
          showAgeDropdown: false,
          customRelationship: "",
        },
      ]);
    }
  };

  const handleAddMore = () => {
    setDistantesDetails([
      ...distantesDetails,
      {
        relationship: "",
        type: null,
        age: "",
        showAgeDropdown: false,
        customRelationship: "",
      },
    ]);
  };

  const handleRelationshipChange = (selectedOption, index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].relationship = selectedOption.value;

    // Clear custom relationship if not "Outro"
    if (selectedOption.value !== "outro") {
      newDetails[index].customRelationship = "";
    }

    setDistantesDetails(newDetails);
  };

  const handleCustomRelationshipChange = (index, value) => {
    const newDetails = [...distantesDetails];
    newDetails[index].customRelationship = value;
    setDistantesDetails(newDetails);
  };

  const handleAgeToggle = (index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
    setDistantesDetails(newDetails);
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
    <div className="fdm-modal-overlay" onClick={onClose}>
      <div className="fdm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="fdm-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="fdm-form-container">
          <h2 className="fdm-title">Etapa 2 - Familiares Distantes</h2>

          <label>
            Algum outro familiar do seu lado materno já teve câncer ou
            neoplasia?
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === true}
                  onChange={() => handleDistantesHadCancerChange(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === false}
                  onChange={() => handleDistantesHadCancerChange(false)}
                />
                Não
              </label>
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === null}
                  onChange={() => handleDistantesHadCancerChange(null)}
                />
                Não tenho conhecimento da saúde dos meus parentes distantes
                maternos
              </label>
            </div>
          </label>

          {distantesHadCancer && (
            <>
              {distantesDetails.map((distante, index) => (
                <div key={index}>
                  <label>
                    Parentesco:
                    <Select
                      options={relationshipOptions}
                      value={relationshipOptions.find(
                        (option) => option.value === distante.relationship
                      )}
                      onChange={(selectedOption) =>
                        handleRelationshipChange(selectedOption, index)
                      }
                    />
                    {/* Show custom input if "Outro" is selected */}
                    {distante.relationship === "outro" && (
                      <div>
                        <span>Qual o parentesco?</span>
                        <input
                          type="text"
                          placeholder="Digite o parentesco"
                          value={distante.customRelationship}
                          onChange={(e) =>
                            handleCustomRelationshipChange(
                              index,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                  </label>
                  <label>
                    Tipo de câncer:
                    <Select
                      options={cancerOptions}
                      value={distante.type}
                      onChange={(selectedOption) => {
                        const newDetails = [...distantesDetails];
                        newDetails[index].type = selectedOption;
                        setDistantesDetails(newDetails);
                      }}
                    />
                  </label>
                  <label>
                    Idade:
                    {distante.showAgeDropdown ? (
                      <Select
                        options={ageOptions}
                        value={distante.age}
                        onChange={(selectedOption) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].age = selectedOption;
                          setDistantesDetails(newDetails);
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Digite a idade"
                        value={distante.age}
                        onChange={(e) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].age = e.target.value;
                          setDistantesDetails(newDetails);
                        }}
                      />
                    )}
                    <button onClick={() => handleAgeToggle(index)}>
                      {distante.showAgeDropdown
                        ? "Digitar idade"
                        : "Selecionar idade"}
                    </button>
                  </label>
                </div>
              ))}
              <button onClick={handleAddMore}>Adicionar outro familiar</button>
            </>
          )}

          <div className="dfm-button-container">
            <button className="dfm-back-button" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="dfm-advance-button" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

FamiliaresDistantesMaterno.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
