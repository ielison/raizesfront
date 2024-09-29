import { useState } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./PrimosPrimasMaternos2.css";
import InfoIcon from "../../assets/information-2-fill.svg"; // Importe o SVG aqui

export default function PrimosPrimasMaternos2() {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [primosHadCancer, setPrimosHadCancer] = useState(null);
  const [primosDetails, setPrimosDetails] = useState([
    { relationship: "", type: null, ages: [], showAgeDropdown: false },
  ]);

  const handleCancerChange = (value) => {
    setPrimosHadCancer(value);
    if (value === true || value === false) {
      setNoKnowledge(false);
    }
  };

  const handleAddTypeCancer = (index, selectedOption) => {
    const newDetails = [...primosDetails];
    newDetails[index].type = selectedOption;

    // Adiciona novos campos de idade para cada tipo de câncer selecionado
    const newAges = selectedOption.map((cancer) => ({
      cancerName: cancer.label, // Guarda o nome do câncer
      age: "",
      showAgeDropdown: false,
    }));
    newDetails[index].ages = newAges; // Adiciona a propriedade ages
    setPrimosDetails(newDetails);
  };

  // Função para adicionar um novo primo ou prima
  const handleAddPrimo = () => {
    setPrimosDetails((prevDetails) => [
      ...prevDetails,
      { relationship: "", type: null, ages: [], showAgeDropdown: false },
    ]);
  };

  // Função para remover um primo ou prima
  const handleRemovePrimo = (index) => {
    setPrimosDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="ppm-form-container">
      <div className="ppm-grupo">
        <label>
          Algum primo ou prima do seu lado materno já teve câncer?
          <div className="ppm-checkbox-group">
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === true}
                onChange={() => handleCancerChange(true)}
              />
              Algum/alguns primos maternos já foram acometidos
            </label>
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === false}
                onChange={() => handleCancerChange(false)}
              />
              Nenhum dos meus primos maternos foram acometidos
            </label>
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={noKnowledge}
                onChange={() => {
                  setNoKnowledge(true);
                  setPrimosHadCancer(null);
                }}
              />
              Não tenho conhecimento da saúde dos meus primos maternos
            </label>
          </div>
        </label>

        {primosHadCancer && !noKnowledge && (
          <>
            {primosDetails.map((primo, index) => (
              <div key={index}>
                <label>
                  Parentesco:
                  <select
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
                  Tipo de câncer:
                  <Select
                    isMulti
                    placeholder="Selecione os tipos de câncer desse familiar"
                    options={cancerOptions}
                    value={primo.type}
                    onChange={(selectedOption) => handleAddTypeCancer(index, selectedOption)}
                  />
                </label>
                {primo.type && primo.ages.map((ageDetail, ageIndex) => (
                  <label key={ageIndex}>
                    Idade do diagnóstico de {ageDetail.cancerName}:
                    {ageDetail.showAgeDropdown ? (
                      <Select
                        placeholder="Selecione.."
                        options={ageOptions}
                        value={ageDetail.age}
                        onChange={(selectedOption) => {
                          const newDetails = [...primosDetails];
                          newDetails[index].ages[ageIndex].age = selectedOption;
                          setPrimosDetails(newDetails);
                        }}
                      />
                    ) : (
                      <input
                        type="number"
                        value={ageDetail.age}
                        onChange={(e) => {
                          const newDetails = [...primosDetails];
                          newDetails[index].ages[ageIndex].age = e.target.value;
                          setPrimosDetails(newDetails);
                        }}
                      />
                    )}
                    <button
                      type="button"
                      className="ppm-toggle-button"
                      onClick={() => {
                        const newDetails = [...primosDetails];
                        newDetails[index].ages[ageIndex].showAgeDropdown =
                          !newDetails[index].ages[ageIndex].showAgeDropdown;
                        setPrimosDetails(newDetails);
                      }}
                    >
                      {ageDetail.showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                    <img
                      src={InfoIcon}
                      alt="Info"
                      className="info-icon-idade"
                      onClick={() =>
                        setTooltipIndex(ageIndex === tooltipIndex ? null : ageIndex)
                      }
                    />
                    {tooltipIndex === ageIndex && (
                      <div className="tooltip-idade--pp">
                        Caso seu paciente não saiba a idade exata do diagnóstico
                        de câncer em um familiar, questione se foi antes ou depois
                        dos 50 anos. Essa estimativa é mais fácil de lembrar e
                        ainda oferece um corte de idade útil para a avaliação de
                        risco.
                      </div>
                    )}
                  </label>
                ))}
                {/* Botão para remover primo */}
                <button type="button" onClick={() => handleRemovePrimo(index)} className="ppm-delete-button">
                  Deletar
                </button>
              </div>
            ))}
            {/* Botão para adicionar novos primos */}
            <button type="button" className="nn-btn-add" onClick={handleAddPrimo}>
              Informar +
            </button>
          </>
        )}
      </div>
    </div>
  );
}
