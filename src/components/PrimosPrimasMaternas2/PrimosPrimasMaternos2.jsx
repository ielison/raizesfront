"use client";

import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import PropTypes from "prop-types";
import "./PrimosPrimasMaternos2.css";

export default function PrimosPrimasMaternos2({
  onFormChange,
  initialData = {},
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [primosHadCancer, setPrimosHadCancer] = useState(() => {
    const stored = localStorage.getItem("ppm2_primosHadCancer");
    return stored
      ? JSON.parse(stored)
      : initialData.primosListMaterno?.[0]?.teveCancer ?? false;
  });
  const [primosDetails, setPrimosDetails] = useState(() => {
    const stored = localStorage.getItem("ppm2_primosDetails");
    return stored
      ? JSON.parse(stored)
      : initialData.primosListMaterno
          ?.filter((primo) => primo.teveCancer)
          .map((primo) => ({
            relationship: primo.sexo === "masculino" ? "primo" : "prima",
            type: primo.outroCancerList.map((cancer) => ({
              value: cancer.tipoCancer,
              label: cancer.tipoCancer,
            })),
            ages: primo.outroCancerList.map((cancer) => ({
              cancerName: cancer.tipoCancer,
              age: cancer.idadeDiagnostico,
              showAgeDropdown: false,
            })),
          })) || [];
  });

  useEffect(() => {
    let primosListMaterno = [];

    if (primosHadCancer === false) {
      primosListMaterno = [
        {
          id: 0,
          temPrimos: false,
          qtdPrimos: 0,
          teveCancer: false,
          qtdPrimosCancer: 0,
          ladoPaterno: "",
          sexo: "",
          outroCancerList: [],
        },
      ];
    } else if (primosHadCancer === true) {
      primosListMaterno = primosDetails.map((primo, index) => ({
        id: index,
        temPrimos: true,
        qtdPrimos: primosDetails.length,
        teveCancer: true,
        qtdPrimosCancer: primo.type ? primo.type.length : 0,
        ladoPaterno: "materno",
        sexo: primo.relationship === "primo" ? "masculino" : "feminino",
        outroCancerList: primo.type
          ? primo.type.map((opt, typeIndex) => ({
              id: typeIndex,
              idadeDiagnostico: primo.ages[typeIndex]?.age || 0,
              tipoCancer: opt.label,
            }))
          : [],
      }));
    }

    onFormChange({ primosListMaterno });
    localStorage.setItem(
      "ppm2_primosHadCancer",
      JSON.stringify(primosHadCancer)
    );
    localStorage.setItem("ppm2_primosDetails", JSON.stringify(primosDetails));
  }, [primosDetails, primosHadCancer, onFormChange]);

  const handleCancerChange = useCallback((value) => {
    setPrimosHadCancer(value);
    localStorage.setItem("ppm2_primosHadCancer", JSON.stringify(value));
    if (value === false) {
      setPrimosDetails([]);
      localStorage.setItem("ppm2_primosDetails", JSON.stringify([]));
    }
  }, []);

  const handleAddTypeCancer = useCallback((index, selectedOption) => {
    setPrimosDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      const currentPrimo = newDetails[index];

      // Create a map of existing cancer types and their ages
      const existingAges = new Map(
        currentPrimo.ages.map((age) => [age.cancerName, age])
      );

      // Update the type
      currentPrimo.type = selectedOption;

      // Update the ages, preserving existing data and adding new entries
      currentPrimo.ages = selectedOption.map((cancer) => {
        const existingAge = existingAges.get(cancer.label);
        return (
          existingAge || {
            cancerName: cancer.label,
            age: "",
            showAgeDropdown: false,
          }
        );
      });

      localStorage.setItem("ppm2_primosDetails", JSON.stringify(newDetails));
      return newDetails;
    });
  }, []);

  const handleAddPrimo = useCallback(() => {
    setPrimosDetails((prevDetails) => {
      const newDetails = [
        ...prevDetails,
        { relationship: "", type: null, ages: [], showAgeDropdown: false },
      ];
      localStorage.setItem("ppm2_primosDetails", JSON.stringify(newDetails));
      return newDetails;
    });
  }, []);

  const handleRemovePrimo = useCallback((index) => {
    setPrimosDetails((prevDetails) => {
      const newDetails = prevDetails.filter((_, i) => i !== index);
      localStorage.setItem("ppm2_primosDetails", JSON.stringify(newDetails));
      return newDetails;
    });
  }, []);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const toggleAgeDropdown = useCallback((primoIndex, ageIndex) => {
    setPrimosDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[primoIndex].ages[ageIndex].showAgeDropdown =
        !newDetails[primoIndex].ages[ageIndex].showAgeDropdown;
      localStorage.setItem("ppm2_primosDetails", JSON.stringify(newDetails));
      return newDetails;
    });
  }, []);

  return (
    <div className="ppp-form-container">
      <div className="question-with-tooltip">
        <label>
          <div className="top-tooltip">
            <div>
              Algum dos seus primos maternos já teve câncer ou algum outro tipo
              de neoplasia?
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
          <div className="ppp-checkbox-group">
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === true}
                onChange={() => handleCancerChange(true)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === false}
                onChange={() => handleCancerChange(false)}
              />
              Não
            </label>
          </div>
        </label>
      </div>

      {primosHadCancer === true && (
        <div className="ppp-grupo">
          {primosDetails.map((primo, index) => (
            <div key={index}>
              <label className="pp-parentesco">
                Parentesco:
                <select
                  className="pp-parentesco-select"
                  value={primo.relationship}
                  onChange={(e) => {
                    const newDetails = [...primosDetails];
                    newDetails[index].relationship = e.target.value;
                    setPrimosDetails(newDetails);
                    localStorage.setItem(
                      "ppm2_primosDetails",
                      JSON.stringify(newDetails)
                    );
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="primo">Primo</option>
                  <option value="prima">Prima</option>
                </select>
              </label>
              <label>
                Tipo de câncer ou neoplasia:
                <Select
                  isMulti
                  placeholder="Selecione os tipos de câncer desse familiar"
                  options={cancerOptions}
                  value={primo.type}
                  onChange={(selectedOption) =>
                    handleAddTypeCancer(index, selectedOption)
                  }
                />
              </label>
              {primo.type &&
                primo.ages.map((ageDetail, ageIndex) => (
                  <label key={ageIndex}>
                    <div className="pp-idade">
                      <div className="avos-width">
                        Idade do diagnóstico para ({ageDetail.cancerName}):
                        {ageDetail.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione.."
                            options={ageOptions}
                            value={
                              ageDetail.age
                                ? {
                                    value: ageDetail.age,
                                    label: ageDetail.age,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              const newDetails = [...primosDetails];
                              newDetails[index].ages[ageIndex].age =
                                selectedOption.value;
                              setPrimosDetails(newDetails);
                              localStorage.setItem(
                                "ppm2_primosDetails",
                                JSON.stringify(newDetails)
                              );
                            }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={ageDetail.age}
                            onChange={(e) => {
                              const newDetails = [...primosDetails];
                              newDetails[index].ages[ageIndex].age =
                                e.target.value;
                              setPrimosDetails(newDetails);
                              localStorage.setItem(
                                "ppm2_primosDetails",
                                JSON.stringify(newDetails)
                              );
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className="ppp-toggle-button"
                        onClick={() => toggleAgeDropdown(index, ageIndex)}
                      >
                        {ageDetail.showAgeDropdown
                          ? "Digitar idade"
                          : "Não sei"}
                      </button>
                    </div>
                  </label>
                ))}

              <button
                className="ff-btn-delete"
                type="button"
                onClick={() => handleRemovePrimo(index)}
              >
                <img src={DeleteIcon} alt="Deletar" />
              </button>
            </div>
          ))}
          <button type="button" className="nn-btn-add" onClick={handleAddPrimo}>
            Informar +
          </button>
        </div>
      )}
    </div>
  );
}

PrimosPrimasMaternos2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    primosListMaterno: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        temPrimos: PropTypes.bool,
        qtdPrimos: PropTypes.number,
        teveCancer: PropTypes.bool,
        qtdPrimosCancer: PropTypes.number,
        ladoPaterno: PropTypes.string,
        sexo: PropTypes.string,
        outroCancerList: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            idadeDiagnostico: PropTypes.number,
            tipoCancer: PropTypes.string,
          })
        ),
      })
    ),
  }),
};
