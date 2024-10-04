"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import PropTypes from "prop-types";

export default function PrimosPrimasPaternos2({
  onFormChange,
  initialData = {},
}) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [primosHadCancer, setPrimosHadCancer] = useState(() => {
    const stored = localStorage.getItem('ppp2_primosHadCancer');
    return stored ? JSON.parse(stored) : initialData.primosListPaterno?.[0]?.teveCancer ?? null;
  });
  const [primosDetails, setPrimosDetails] = useState(() => {
    const stored = localStorage.getItem('ppp2_primosDetails');
    return stored ? JSON.parse(stored) : initialData.primosListPaterno
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
    let primosListPaterno = [];

    if (primosHadCancer === false) {
      primosListPaterno = [
        {
          id: 0,
          temPrimos: true,
          qtdPrimos: 0,
          teveCancer: false,
          qtdPrimosCancer: 0,
          ladoPaterno: "paterno",
          sexo: "",
          outroCancerList: [],
        },
      ];
    } else if (primosHadCancer === true) {
      primosListPaterno = primosDetails.map((primo, index) => ({
        id: index,
        temPrimos: true,
        qtdPrimos: primosDetails.length,
        teveCancer: true,
        qtdPrimosCancer: primo.type ? primo.type.length : 0,
        ladoPaterno: "paterno",
        sexo: primo.relationship === "primo" ? "masculino" : "feminino",
        outroCancerList: primo.type
          ? primo.type.map((opt, typeIndex) => ({
              id: typeIndex,
              idadeDiagnostico: primo.ages[typeIndex]?.age || 0,
              tipoCancer: opt.label,
            }))
          : [],
      }));
    } else {
      primosListPaterno = [
        {
          id: 0,
          temPrimos: false,
          qtdPrimos: 0,
          teveCancer: false,
          qtdPrimosCancer: 0,
          ladoPaterno: "paterno",
          sexo: "",
          outroCancerList: [],
        },
      ];
    }

    onFormChange({ primosListPaterno });
    localStorage.setItem('ppp2_primosHadCancer', JSON.stringify(primosHadCancer));
    localStorage.setItem('ppp2_primosDetails', JSON.stringify(primosDetails));
  }, [primosDetails, primosHadCancer, onFormChange]);

  const handleCancerChange = (value) => {
    setPrimosHadCancer(value);
    localStorage.setItem('ppp2_primosHadCancer', JSON.stringify(value));
    if (value === false) {
      setPrimosDetails([]);
      localStorage.setItem('ppp2_primosDetails', JSON.stringify([]));
    }
  };

  const handleAddTypeCancer = (index, selectedOption) => {
    const newDetails = [...primosDetails];
    newDetails[index].type = selectedOption;
    const newAges = selectedOption.map((cancer) => ({
      cancerName: cancer.label,
      age: "",
      showAgeDropdown: false,
    }));
    newDetails[index].ages = newAges;
    setPrimosDetails(newDetails);
    localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
  };

  const handleAddPrimo = () => {
    const newDetails = [
      ...primosDetails,
      { relationship: "", type: null, ages: [], showAgeDropdown: false },
    ];
    setPrimosDetails(newDetails);
    localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
  };

  const handleRemovePrimo = (index) => {
    const newDetails = primosDetails.filter((_, i) => i !== index);
    setPrimosDetails(newDetails);
    localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
  };

  return (
    <div className="ppp-form-container">
      <div className="ppp-grupo">
        <label>
           Algum/alguns primos paternos já tiveram câncer ou neoplasia?
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

        {primosHadCancer === true && (
          <>
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
                      localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
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
                        <div>
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
                                localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
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
                                localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          className="ppp-toggle-button"
                          onClick={() => {
                            const newDetails = [...primosDetails];
                            newDetails[index].ages[ageIndex].showAgeDropdown =
                              !newDetails[index].ages[ageIndex].showAgeDropdown;
                            setPrimosDetails(newDetails);
                            localStorage.setItem('ppp2_primosDetails', JSON.stringify(newDetails));
                          }}
                        >
                          {ageDetail.showAgeDropdown
                            ? "Digitar idade"
                            : "Não sei"}
                        </button>
                        <img
                          src={InfoIcon}
                          alt="Info"
                          className="info-icon-idade"
                          onClick={() =>
                            setTooltipIndex(
                              ageIndex === tooltipIndex ? null : ageIndex
                            )
                          }
                        />
                        {tooltipIndex === ageIndex && (
                          <div className="tooltip-idade--pp">
                            Caso seu paciente não saiba a idade exata do
                            diagnóstico de câncer em um familiar, questione se
                            foi antes ou depois dos 50 anos. Essa estimativa é
                            mais fácil de lembrar e ainda oferece um corte de
                            idade útil para a avaliação de risco.
                          </div>
                        )}
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
            <button
              type="button"
              className="nn-btn-add"
              onClick={handleAddPrimo}
            >
              Informar +
            </button>
          </>
        )}
      </div>
    </div>
  );
}

PrimosPrimasPaternos2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    primosListPaterno: PropTypes.arrayOf(
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
