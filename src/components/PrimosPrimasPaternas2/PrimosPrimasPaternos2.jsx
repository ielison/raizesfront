import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./PrimosPrimasPaternos2.css";
import InfoIcon from "../../assets/information-2-fill.svg";
import PropTypes from "prop-types";
import DeleteIcon from "../../assets/trash.svg";

export default function PrimosPrimasPaternos2({ onFormChange }) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [primosHadCancer, setPrimosHadCancer] = useState(null);
  const [primosDetails, setPrimosDetails] = useState([]);

  useEffect(() => {
    let primosListPaterno = [];

    if (primosHadCancer === false) {
      // Se não houve câncer, retorna um único objeto indicando isso
      primosListPaterno = [{
        id: 0,
        temPrimos: true,
        qtdPrimos: 0,
        teveCancer: false,
        qtdPrimosCancer: 0,
        ladoPaterno: "paterno",
        sexo: "",
        outroCancerList: []
      }];
    } else if (primosHadCancer === true) {
      // Se houve câncer, mapeia os detalhes dos primos
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
              idadeDiagnostico: primo.ages[typeIndex]?.age || "",
              tipoCancer: opt.label,
            }))
          : [],
      }));
    }

    onFormChange({ primosListPaterno });
  }, [primosDetails, primosHadCancer, onFormChange]);

  const handleCancerChange = (value) => {
    setPrimosHadCancer(value);
    if (value === false) {
      // Limpa os detalhes dos primos se a resposta for "Não"
      setPrimosDetails([]);
    }
  };

  const handleAddTypeCancer = (index, selectedOption) => {
    const newDetails = [...primosDetails];
    newDetails[index].type = selectedOption;

    // Adiciona novos campos de idade para cada tipo de câncer selecionado
    const newAges = selectedOption.map((cancer) => ({
      cancerName: cancer.label,
      age: "",
      showAgeDropdown: false,
    }));
    newDetails[index].ages = newAges;
    setPrimosDetails(newDetails);
  };

  const handleAddPrimo = () => {
    setPrimosDetails((prevDetails) => [
      ...prevDetails,
      { relationship: "", type: null, ages: [], showAgeDropdown: false },
    ]);
  };

  const handleRemovePrimo = (index) => {
    setPrimosDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="ppp-form-container">
      <div className="ppp-grupo">
        <label>
          Algum/alguns primos paternos já foram acometidos?
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
};