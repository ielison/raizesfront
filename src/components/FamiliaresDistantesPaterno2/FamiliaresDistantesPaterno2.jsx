"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./FamiliaresDistantesPaterno2.css";
import DeleteIcon from "../../assets/trash.svg";
import PropTypes from "prop-types";
import InfoIcon from "../../assets/information-2-fill.svg";

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
  const [distantesHadCancer, setDistantesHadCancer] = useState(() => {
    const stored = localStorage.getItem("fdp2_distantesHadCancer");
    return stored ? JSON.parse(stored) : null;
  });
  const [distantesDetails, setDistantesDetails] = useState(() => {
    const stored = localStorage.getItem("fdp2_distantesDetails");
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

  useEffect(() => {
    let outroFamiliarListPaterno = [];

    if (distantesHadCancer === false || distantesHadCancer === null) {
      outroFamiliarListPaterno = [
        {
          id: 0,
          teveCancer: false,
          qualFamiliar: "",
          outroCancerList: [],
        },
      ];
    } else if (distantesHadCancer === true) {
      outroFamiliarListPaterno = distantesDetails.map((distante, index) => ({
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

    onFormChange({ outroFamiliarListPaterno });
    localStorage.setItem(
      "fdp2_distantesHadCancer",
      JSON.stringify(distantesHadCancer)
    );
    localStorage.setItem(
      "fdp2_distantesDetails",
      JSON.stringify(distantesDetails)
    );
  }, [distantesDetails, distantesHadCancer, onFormChange]);

  const handleDistantesHadCancerChange = (value) => {
    setDistantesHadCancer(value);
    localStorage.setItem("fdp2_distantesHadCancer", JSON.stringify(value));

    if (value === false || value === null) {
      const initialDetails = [
        {
          relationship: "",
          cancerTypes: [],
          showAgeDropdowns: [],
          customRelationship: "",
        },
      ];
      setDistantesDetails(initialDetails);
      localStorage.setItem(
        "fdp2_distantesDetails",
        JSON.stringify(initialDetails)
      );
    }
  };

  const handleAddMore = () => {
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
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleDelete = (index) => {
    const newDetails = distantesDetails.filter((_, i) => i !== index);
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleRelationshipChange = (selectedOption, index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].relationship = selectedOption.value;

    if (selectedOption.value !== "outro") {
      newDetails[index].customRelationship = "";
    }

    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleCustomRelationshipChange = (index, value) => {
    const newDetails = [...distantesDetails];
    newDetails[index].customRelationship = value;
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleCancerTypeChange = (selectedOption, index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].cancerTypes = selectedOption.map((option) => ({
      ...option,
      showTooltip: false,
    }));

    newDetails[index].showAgeDropdowns = new Array(selectedOption.length).fill(
      false
    );
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const toggleTooltip = (typeIndex, detailIndex) => {
    const newDetails = [...distantesDetails];
    newDetails[detailIndex].cancerTypes[typeIndex].showTooltip =
      !newDetails[detailIndex].cancerTypes[typeIndex].showTooltip;
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleAgeToggle = (typeIndex, detailIndex) => {
    const newDetails = [...distantesDetails];
    newDetails[detailIndex].showAgeDropdowns[typeIndex] =
      !newDetails[detailIndex].showAgeDropdowns[typeIndex];
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  const handleAgeChange = (e, typeIndex, detailIndex) => {
    const newDetails = [...distantesDetails];
    newDetails[detailIndex].cancerTypes[typeIndex].age = e.target.value;
    setDistantesDetails(newDetails);
    localStorage.setItem("fdp2_distantesDetails", JSON.stringify(newDetails));
  };

  return (
    <div className="fdp-content">
      <label>
        Algum outro familiar do seu lado paterno já teve câncer ou neoplasia?
        <div className="fdm-subtitle">
          Familiares distantes como tios-avôs e primos de segundo grau
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
            Não tenho conhecimento da saúde dos meus parentes distantes paternos
          </label>
        </div>
      </label>

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
                              "fdp2_distantesDetails",
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
                    <img
                      src={InfoIcon}
                      alt="Info"
                      className="info-icon-idade"
                      onClick={() => toggleTooltip(typeIndex, index)}
                    />
                    {cancer.showTooltip && (
                      <div className="tooltip-idade">
                        Caso seu paciente não saiba a idade exata do diagnóstico
                        de câncer em um familiar, questione se foi antes ou
                        depois dos 50 anos. Essa estimativa é mais fácil de
                        lembrar e ainda oferece um corte de idade útil para a
                        avaliação de risco.
                      </div>
                    )}
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

FamiliaresDistantesPaterno2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
