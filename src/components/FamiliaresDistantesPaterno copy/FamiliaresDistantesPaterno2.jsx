import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./FamiliaresDistantesPaterno2.css";
import PropTypes from "prop-types";

const relationshipOptions = [
  { value: "meio-tio paterno", label: "Meio-Tio Paterno" },
  { value: "meia-tia paterna", label: "Meia-Tia Paterna" },
  { value: "tio-avô paterno", label: "Tio-Avô Paterno" },
  { value: "tia-avó paterna", label: "Tia-Avó Paterna" },
  { value: "prima paterna 2o grau", label: "Prima Paterna 2º Grau" },
  { value: "primo paterno 2o grau", label: "Primo Paterno 2º Grau" },
  { value: "prima paterna 3o grau", label: "Prima Paterna 3º Grau" },
  { value: "primo paterno 3o grau", label: "Primo Paterno 3º Grau" },
  { value: "bisavô paterno", label: "Bisavô Paterno" },
  { value: "bisavó paterna", label: "Bisavó Paterna" },
  { value: "bisneto", label: "Bisneto" },
  { value: "bisneta", label: "Bisneta" },
  { value: "outro", label: "Outro" },
];

export default function FamiliaresDistantesPaterno2({ onFormChange }) {
  const [distantesHadCancer, setDistantesHadCancer] = useState(null);
  const [distantesDetails, setDistantesDetails] = useState([
    {
      relationship: "",
      cancerTypes: [],
      showAgeDropdowns: [],
      customRelationship: "",
    },
  ]);

  useEffect(() => {
    // Atualiza a lista de familiares distantes ao mudar
    onFormChange({
      outroFamiliarList: distantesDetails.map((distante, index) => ({
        id: 0,
        teveCancer: distantesHadCancer,
        qualFamiliar: distante.relationship || distante.customRelationship,
        outroCancerList: distante.cancerTypes.map((cancer) => ({
          id: 0,
          idadeDiagnostico: cancer.age || 0,
          tipoCancer: cancer.label || "",
        })),
      })),
    });
  }, [distantesDetails, distantesHadCancer, onFormChange]);

  const handleDistantesHadCancerChange = (value) => {
    setDistantesHadCancer(value);

    if (value === false) {
      setDistantesDetails([
        {
          relationship: "",
          cancerTypes: [],
          showAgeDropdowns: [],
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
        cancerTypes: [],
        showAgeDropdowns: [],
        customRelationship: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    const newDetails = distantesDetails.filter((_, i) => i !== index);
    setDistantesDetails(newDetails);
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

  const handleCancerTypeChange = (selectedOption, index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].cancerTypes = selectedOption || [];

    // Update showAgeDropdowns to match the number of selected cancer types
    newDetails[index].showAgeDropdowns = new Array(selectedOption.length).fill(
      false
    );

    setDistantesDetails(newDetails);
  };

  const handleAgeToggle = (typeIndex, detailIndex) => {
    const newDetails = [...distantesDetails];
    newDetails[detailIndex].showAgeDropdowns[typeIndex] =
      !newDetails[detailIndex].showAgeDropdowns[typeIndex];
    setDistantesDetails(newDetails);
  };

  const handleAgeChange = (e, typeIndex, detailIndex) => {
    const newDetails = [...distantesDetails];
    newDetails[detailIndex].cancerTypes[typeIndex].age = e.target.value;
    setDistantesDetails(newDetails);
  };

  return (
    <div className="fdp-content">
      <label>
        Algum outro familiar do seu lado paterno já teve câncer?
        <div className="radio-group--fdp">
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
            Não tenho conhecimento da saúde dos meus parentes distantes paternos
          </label>
        </div>
      </label>

      {distantesHadCancer && (
        <>
          {distantesDetails.map((distante, index) => (
            <div key={index} className="distante-details">
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
                  isMulti
                  placeholder="Selecione o tipo de câncer"
                  options={cancerOptions}
                  value={distante.cancerTypes}
                  onChange={(selectedOption) =>
                    handleCancerTypeChange(selectedOption, index)
                  }
                />
              </label>
              {distante.cancerTypes.map((cancer, typeIndex) => (
                <div key={typeIndex} className="cancer-detail">
                  <label>
                    Idade do diagnóstico de {cancer.label}
                    {distante.showAgeDropdowns[typeIndex] ? (
                      <Select
                        options={ageOptions}
                        value={
                          cancer.age
                            ? { label: cancer.age, value: cancer.age }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].cancerTypes[typeIndex].age =
                            selectedOption?.value || "";
                          setDistantesDetails(newDetails);
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Digite a idade"
                        value={cancer.age || ""}
                        onChange={(e) => handleAgeChange(e, typeIndex, index)}
                      />
                    )}
                    <button onClick={() => handleAgeToggle(typeIndex, index)}>
                      {distante.showAgeDropdowns[typeIndex]
                        ? "Digitar idade"
                        : "Não sei"}
                    </button>
                  </label>
                </div>
              ))}
              {/* Botão de delete para remover o detalhe */}
              <button
                className="nn-btn-delete"
                onClick={() => handleDelete(index)}
              >
                Deletar
              </button>
            </div>
          ))}
          {/* Botão "Informar +" movido para o final */}
          <button className="nn-btn-add" onClick={handleAddMore}>
            Informar +
          </button>
        </>
      )}
    </div>
  );
}


FamiliaresDistantesPaterno2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
