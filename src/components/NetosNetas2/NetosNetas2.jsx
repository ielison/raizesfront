import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import "./NetosNetas2.css";

export default function NetosNetas2({ onFormChange }) {
  const [hasGrandchildren, setHasGrandchildren] = useState(null);
  const [hasCancer, setHasCancer] = useState(false);
  const [grandchildren, setGrandchildren] = useState([]);
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [grandsonCount, setGrandsonCount] = useState(0);
  const [granddaughterCount, setGranddaughterCount] = useState(0);

  useEffect(() => {
    // Atualiza os dados dos netos e netas ao mudar
    onFormChange({
      netosList: grandchildren.map((grandchild, index) => ({
        id: index,
        temNetos: true,
        qtdNetos: grandsonCount + granddaughterCount, // Total count of grandchildren
        teveCancer: hasCancer,
        qtdNetosCancer: grandchild.type.length > 0 ? grandchild.type.length : 0,
        sexo: grandchild.sex,
        mesmoPais: true,
        outroCancerList: grandchild.type.map((opt) => ({
          id: opt.id || 0, // ID único para cada tipo de câncer
          idadeDiagnostico: opt.age?.value || opt.age || "", // Idade do diagnóstico do tipo de câncer
          tipoCancer: opt.label,
        })),
      })),
    });
  }, [grandchildren, hasCancer, grandsonCount, granddaughterCount, onFormChange]);

  const handleAddGrandchild = () => {
    setGrandchildren([
      ...grandchildren,
      { sex: "", type: [], showAgeDropdowns: {} }, // showAgeDropdowns será um objeto para controlar dropdowns múltiplos
    ]);
  };

  const handleDeleteGrandchild = (indexToDelete) => {
    setGrandchildren(grandchildren.filter((_, index) => index !== indexToDelete));
  };

  const toggleAgeDropdown = (index, typeId) => {
    const newGrandchildren = [...grandchildren];
    const showAgeDropdowns = newGrandchildren[index].showAgeDropdowns || {};
    showAgeDropdowns[typeId] = !showAgeDropdowns[typeId];
    newGrandchildren[index].showAgeDropdowns = showAgeDropdowns;
    setGrandchildren(newGrandchildren);
  };

  return (
    <div className="nn-form-container">
      <label>
        O(A) Sr(a) tem netos e netas?
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="hasGrandchildren"
              value="sim"
              checked={hasGrandchildren === true}
              onChange={() => setHasGrandchildren(true)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasGrandchildren"
              value="nao"
              checked={hasGrandchildren === false}
              onChange={() => setHasGrandchildren(false)}
            />
            Não
          </label>
        </div>
      </label>

      {hasGrandchildren && (
        <>
          <div className="qtd-netos">
            <label>
              Quantidade de neto(s)
              <input
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  const count = value >= 0 ? parseInt(value) : 0;
                  setGrandsonCount(count);
                }}
              />
            </label>
            <label>
              Quantidade de neta(s)
              <input
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  const count = value >= 0 ? parseInt(value) : 0;
                  setGranddaughterCount(count);
                }}
              />
            </label>
          </div>

          <label>
            Algum deles já teve câncer ou algum outro tipo de neoplasia?
            <div className="checkbox-group">
              <label>
                <input
                  type="radio"
                  name="hasCancer"
                  value="sim"
                  checked={hasCancer === true}
                  onChange={() => setHasCancer(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="hasCancer"
                  value="nao"
                  checked={hasCancer === false}
                  onChange={() => setHasCancer(false)}
                />
                Não
              </label>
            </div>
          </label>

          {hasCancer && (
            <>
              {grandchildren.map((grandchild, index) => (
                <div key={index} className="grandchild-container">
                  <label>
                    Parentesco
                    <Select
                      options={[
                        { value: "neto", label: "Neto" },
                        { value: "neta", label: "Neta" },
                      ]}
                      onChange={(selectedOption) => {
                        const newGrandchildren = [...grandchildren];
                        newGrandchildren[index].sex = selectedOption.value;
                        setGrandchildren(newGrandchildren);
                      }}
                      placeholder="Selecione o sexo"
                    />
                  </label>
                  <label>
                    Selecione o tipo de câncer ou neoplasia
                    <Select
                      isMulti
                      placeholder="Selecione o tipo de câncer"
                      options={cancerOptions}
                      value={grandchild.type}
                      onChange={(selectedOptions) => {
                        const newGrandchildren = [...grandchildren];
                        newGrandchildren[index].type = selectedOptions.map((opt) => ({
                          ...opt,
                          age: "", // Inicializa o campo de idade para cada tipo de câncer
                        }));
                        setGrandchildren(newGrandchildren);
                      }}
                    />
                  </label>

                  {grandchild.type.map((cancerType, typeIndex) => (
                    <label key={typeIndex} className="nn-idade">
                      <div className="nn">
                        Idade do diagnóstico ({cancerType.label})
                        {grandchild.showAgeDropdowns?.[cancerType.value] ? (
                          <Select
                            placeholder="Selecione..."
                            options={ageOptions}
                            value={cancerType.age}
                            onChange={(selectedOption) => {
                              const newGrandchildren = [...grandchildren];
                              newGrandchildren[index].type[typeIndex].age =
                                selectedOption;
                              setGrandchildren(newGrandchildren);
                            }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={cancerType.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newGrandchildren = [...grandchildren];
                              newGrandchildren[index].type[typeIndex].age =
                                value >= 0 ? value : 0;
                              setGrandchildren(newGrandchildren);
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleAgeDropdown(index, cancerType.value)
                        }
                      >
                        {grandchild.showAgeDropdowns?.[cancerType.value]
                          ? "Digitar idade"
                          : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(
                            index === tooltipIndex ? null : index
                          )
                        } // Alterna o tooltip ao clicar
                      />

                      {tooltipIndex === index && (
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade útil
                          para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  ))}

                  <button
                    className="nn-btn-delete"
                    type="button"
                    onClick={() => handleDeleteGrandchild(index)}
                  >
                    <img src={DeleteIcon} alt="Deletar" />
                  </button>
                </div>
              ))}
              <button className="nn-btn-add" onClick={handleAddGrandchild}>
                Informar +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

NetosNetas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
