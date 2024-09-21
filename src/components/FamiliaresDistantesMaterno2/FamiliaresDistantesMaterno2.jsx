import { useState } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./FamiliaresDistantesMaterno2.css";

const relationshipOptions = [
  { value: "meio-tio materno", label: "Meio-Tio Materno" },
  { value: "meia-tia materna", label: "Meia-Tia Materna" },
  { value: "tio-avô materno", label: "Tio-Avô Materno" },
  { value: "tia-avó materna", label: "Tia-Avó Materna" },
  { value: "prima materna 2o grau", label: "Prima Materna 2º Grau" },
  { value: "primo materno 2o grau", label: "Primo Materno 2º Grau" },
  { value: "prima materna 3o grau", label: "Prima Materna 3º Grau" },
  { value: "primo materno 3o grau", label: "Primo Materno 3º Grau" },
  { value: "bisavô materno", label: "Bisavô Materno" },
  { value: "bisavó materna", label: "Bisavó Materna" },
  { value: "bisneto", label: "Bisneto" },
  { value: "bisneta", label: "Bisneta" },
  { value: "outro", label: "Outro" },
];

export default function FamiliaresDistantesMaterno2() {
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

  return (
    <div className="fdm-content">
      <label>
        Algum outro familiar do seu lado materno já teve câncer?
        <div className="radio-group--fdm">
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
            Não tenho conhecimento da saúde dos meus parentes distantes maternos
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
                  placeholder="Selecione o parentesco"
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
                        handleCustomRelationshipChange(index, e.target.value)
                      }
                    />
                  </div>
                )}
              </label>
              <label>
                Tipo de câncer ou neoplasia:
                <Select
                  placeholder="Selecione o tipo de câncer"
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
          <button className="nn-btn-add" onClick={handleAddMore}>
            Informar +
          </button>
        </>
      )}
    </div>
  );
}
