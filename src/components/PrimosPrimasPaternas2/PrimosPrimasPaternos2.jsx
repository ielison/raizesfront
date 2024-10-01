import { useState, useEffect } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./PrimosPrimasPaternos2.css"; // Altere para o CSS apropriado
import InfoIcon from "../../assets/information-2-fill.svg"; // Importe o SVG aqui
import PropTypes from "prop-types";
import DeleteIcon from "../../assets/trash.svg";

export default function PrimosPrimasPaternos2({ onFormChange }) {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(true);
  const [primosHadCancer, setPrimosHadCancer] = useState(false);
  const [primosDetails, setPrimosDetails] = useState([
    { relationship: "", type: null, ages: [], showAgeDropdown: false },
  ]);

  useEffect(() => {
    const primosList = [];

    // Se não tiver conhecimento, retorna dados apropriados
    if (noKnowledge) {
      onFormChange({ primosList: [] }); // Retorna uma lista vazia se não houver conhecimento
      return;
    }

    // Mapeia primosDetails para preencher primosList
    primosDetails.forEach((primo, index) => {
      // Se nenhum primo teve câncer, adicione um objeto indicando isso
      if (!primosHadCancer) {
        primosList.push({
          id: index,
          temPrimos: true,
          qtdPrimos: primosDetails.length,
          teveCancer: false,
          qtdPrimosCancer: 0,
          ladoPaterno: primo.relationship,
          sexo: primo.relationship === "primo" ? "masculino" : "feminino",
          outroCancerList: [],
        });
      } else {
        // Caso contrário, retorna os dados reais
        primosList.push({
          id: index,
          temPrimos: true,
          qtdPrimos: primosDetails.length,
          teveCancer: true,
          qtdPrimosCancer: primo.type ? primo.type.length : 0,
          ladoPaterno: primo.relationship,
          sexo: primo.relationship === "primo" ? "masculino" : "feminino",
          outroCancerList: primo.type
            ? primo.type.map((opt, typeIndex) => {
                const ageDetail = primo.ages[typeIndex];
                return {
                  id: 0, // ID único para cada tipo de câncer
                  idadeDiagnostico: ageDetail.age || "", // Certifique-se de pegar o valor diretamente
                  tipoCancer: opt.label,
                };
              })
            : [],
        });
      }
    });

    // Chama a função de alteração de formulário com a lista atualizada
    onFormChange({ primosList });
  }, [primosDetails, primosHadCancer, onFormChange, noKnowledge]);
  
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
    setPrimosDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="ppp-form-container">
      <div className="ppp-grupo">
        <label>
          Algum primo ou prima do seu lado paterno já teve câncer ou neoplasia?
          <div className="ppp-checkbox-group">
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === true}
                onChange={() => handleCancerChange(true)}
              />
              Algum/alguns primos paternos já foram acometidos
            </label>
            <label>
              <input
                type="radio"
                name="primosCancer"
                checked={primosHadCancer === false}
                onChange={() => handleCancerChange(false)}
              />
              Nenhum dos meus primos paternos foram acometidos
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
              Não tenho conhecimento da saúde dos meus primos paternos
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
                      Idade do diagnóstico de {ageDetail.cancerName}:
                      {ageDetail.showAgeDropdown ? (
                        <Select
                          placeholder="Selecione.."
                          options={ageOptions}
                          value={
                            ageDetail.age
                              ? { value: ageDetail.age, label: ageDetail.age }
                              : null
                          }
                          onChange={(selectedOption) => {
                            const newDetails = [...primosDetails];
                            newDetails[index].ages[ageIndex].age =
                              selectedOption.value; // Armazena apenas o valor
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
                              e.target.value; // Atualiza a idade
                            setPrimosDetails(newDetails);
                          }}
                        />
                      )}
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
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  ))}

                {/* Botão para remover primo */}
                <button
                  className="ff-btn-delete"
                  type="button"
                  onClick={() => handleRemovePrimo(index)}
                >
                  <img src={DeleteIcon} alt="Deletar" />
                </button>
              </div>
            ))}
            {/* Botão para adicionar novos primos */}
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
