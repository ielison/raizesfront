"use client";

import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./FamiliaresDistantesMaterno2.css";
import DeleteIcon from "../../assets/trash.svg";
import PropTypes from "prop-types";
import InfoIcon from "../../assets/infoicon.svg";

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

export default function FamiliaresDistantesMaterno2({ onFormChange }) {
  const [distantesHadCancer, setDistantesHadCancer] = useState(() => {
    const stored = localStorage.getItem("fdm2_distantesHadCancer");
    return stored ? JSON.parse(stored) : null;
  });
  const [distantesDetails, setDistantesDetails] = useState(() => {
    const stored = localStorage.getItem("fdm2_distantesDetails");
    return stored
      ? JSON.parse(stored)
      : [
          {
            relationship: "",
            cancerTypes: [],
            showAgeDropdowns: [],
            customRelationship: "",
          },
        ];
  });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let outroFamiliarListMaterno = [];

    if (distantesHadCancer === false || distantesHadCancer === null) {
      outroFamiliarListMaterno = [
        {
          id: 0,
          teveCancer: false,
          qualFamiliar: "",
          outroCancerList: [],
        },
      ];
    } else if (distantesHadCancer === true) {
      outroFamiliarListMaterno = distantesDetails.map((distante, index) => ({
        id: index,
        teveCancer: true,
        qualFamiliar: distante.relationship || distante.customRelationship,
        outroCancerList: distante.cancerTypes.map((cancer) => ({
          id: 0,
          idadeDiagnostico: cancer.age || 0,
          tipoCancer: cancer.label || "",
        })),
      }));
    }

    onFormChange({ outroFamiliarListMaterno });
    localStorage.setItem(
      "fdm2_distantesHadCancer",
      JSON.stringify(distantesHadCancer)
    );
    localStorage.setItem(
      "fdm2_distantesDetails",
      JSON.stringify(distantesDetails)
    );
  }, [distantesDetails, distantesHadCancer, onFormChange]);

  const handleDistantesHadCancerChange = useCallback((value) => {
    setDistantesHadCancer(value);
    localStorage.setItem("fdm2_distantesHadCancer", JSON.stringify(value));

    if (value === false || value === null) {
      setDistantesDetails([
        {
          relationship: "",
          cancerTypes: [],
          showAgeDropdowns: [],
          customRelationship: "",
        },
      ]);
      localStorage.setItem(
        "fdm2_distantesDetails",
        JSON.stringify([
          {
            relationship: "",
            cancerTypes: [],
            showAgeDropdowns: [],
            customRelationship: "",
          },
        ])
      );
    }
  }, []);

  const handleAddMore = useCallback(() => {
    const newDetails = [
      ...distantesDetails,
      {
        relationship: "",
        cancerTypes: [],
        showAgeDropdowns: [],
        customRelationship: "",
      },
    ];
    setDistantesDetails(newDetails);
    localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
  }, [distantesDetails]);

  const handleDelete = useCallback(
    (index) => {
      const newDetails = distantesDetails.filter((_, i) => i !== index);
      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  const handleRelationshipChange = useCallback(
    (selectedOption, index) => {
      const newDetails = [...distantesDetails];
      newDetails[index].relationship = selectedOption.value;

      if (selectedOption.value !== "outro") {
        newDetails[index].customRelationship = "";
      }

      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  const handleCustomRelationshipChange = useCallback(
    (index, value) => {
      const newDetails = [...distantesDetails];
      newDetails[index].customRelationship = value;
      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  const handleCancerTypeChange = useCallback(
    (selectedOption, index) => {
      const newDetails = [...distantesDetails];
      newDetails[index].cancerTypes = selectedOption.map((option) => ({
        ...option,
        showTooltip: false,
      }));

      newDetails[index].showAgeDropdowns = new Array(
        selectedOption.length
      ).fill(false);
      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const handleAgeToggle = useCallback(
    (typeIndex, detailIndex) => {
      const newDetails = [...distantesDetails];
      newDetails[detailIndex].showAgeDropdowns[typeIndex] =
        !newDetails[detailIndex].showAgeDropdowns[typeIndex];
      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  const handleAgeChange = useCallback(
    (e, typeIndex, detailIndex) => {
      const newDetails = [...distantesDetails];
      newDetails[detailIndex].cancerTypes[typeIndex].age = e.target.value;
      setDistantesDetails(newDetails);
      localStorage.setItem("fdm2_distantesDetails", JSON.stringify(newDetails));
    },
    [distantesDetails]
  );

  return (
    <div className="fdp-content">
      <div className="question-with-tooltip">
        <label>
          <div className="top-tooltip">
            <div>
              Algum outro familiar do seu lado materno já teve câncer ou outro
              tipo de neoplasia?
              <div className="fdm-subtitle">
                Familiares distantes como tios-avôs e primos de segundo grau
              </div>
            </div>
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
                  câncer em um familiar, questione se foi antes ou depois dos 50
                  anos. Essa estimativa é mais fácil de lembrar e ainda oferece
                  um corte de idade útil para a avaliação de risco.
                </div>
              )}
            </div>
          </div>
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
              Não tenho conhecimento da saúde dos meus parentes distantes
              maternos
            </label>
          </div>
        </label>
      </div>

      {distantesHadCancer === true && (
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
                <div key={typeIndex}>
                  <label className="fd-cancer-detail">
                    <div className="cancer-detail-div">
                      Idade do diagnóstico para ({cancer.label})
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
                            localStorage.setItem(
                              "fdm2_distantesDetails",
                              JSON.stringify(newDetails)
                            );
                          }}
                        />
                      ) : (
                        <input
                          type="number"
                          placeholder="Digite a idade"
                          value={cancer.age || ""}
                          onChange={(e) => handleAgeChange(e, typeIndex, index)}
                        />
                      )}
                    </div>
                    <button
                      className="btn-ns"
                      onClick={() => handleAgeToggle(typeIndex, index)}
                    >
                      {distante.showAgeDropdowns[typeIndex]
                        ? "Digitar idade"
                        : "Não sei"}
                    </button>
                  </label>
                </div>
              ))}
              <button
                className="ff-btn-delete"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <img src={DeleteIcon} alt="Deletar" />
              </button>
            </div>
          ))}
          <div className="btn-fd">
            <button className="fd-btn-add" onClick={handleAddMore}>
              Informar +
            </button>
          </div>
        </>
      )}
    </div>
  );
}

FamiliaresDistantesMaterno2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
