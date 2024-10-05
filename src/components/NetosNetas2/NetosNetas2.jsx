"use client";

import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import "./NetosNetas2.css";

export default function NetosNetas2({ onFormChange }) {
  const [hasGrandchildren, setHasGrandchildren] = useState(() => {
    return JSON.parse(localStorage.getItem("hasGrandchildren")) || false;
  });

  const [hasCancer, setHasCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("hasCancer")) || false;
  });

  const [grandchildCount, setGrandchildCount] = useState(() => {
    const storedGrandchildCount = JSON.parse(localStorage.getItem("grandchildCount"));
    return storedGrandchildCount
      ? {
          grandsons: storedGrandchildCount.grandsons || "",
          granddaughters: storedGrandchildCount.granddaughters || "",
        }
      : { grandsons: "", granddaughters: "" };
  });

  const [grandchildren, setGrandchildren] = useState(() => {
    const storedGrandchildren = JSON.parse(localStorage.getItem("grandchildren"));
    return storedGrandchildren || [];
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem("hasGrandchildren", JSON.stringify(hasGrandchildren));
    localStorage.setItem("hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem("grandchildCount", JSON.stringify(grandchildCount));
    localStorage.setItem("grandchildren", JSON.stringify(grandchildren));

    let netosList;

    if (hasGrandchildren === false) {
      netosList = [
        {
          id: 0,
          temNetos: false,
          qtdNetos: 0,
          teveCancer: false,
          qtdNetosCancer: 0,
          sexo: "",
          mesmoPais: true,
          outroCancerList: [],
        },
      ];
    } else if (hasCancer) {
      netosList = grandchildren.map((grandchild, index) => ({
        id: index,
        temNetos: true,
        qtdNetos:
          (parseInt(grandchildCount.grandsons) || 0) +
          (parseInt(grandchildCount.granddaughters) || 0),
        teveCancer: true,
        qtdNetosCancer: grandchildren.filter((c) => c.type.length > 0).length,
        sexo: grandchild.sex === "neto" ? "masculino" : "feminino",
        mesmoPais: true,
        outroCancerList: grandchild.type.map((opt, idx) => ({
          id: idx,
          idadeDiagnostico: opt.age?.value || opt.age || 0,
          tipoCancer: opt.label,
        })),
      }));
    } else {
      netosList = [
        {
          id: 0,
          temNetos: true,
          qtdNetos:
            (parseInt(grandchildCount.grandsons) || 0) +
            (parseInt(grandchildCount.granddaughters) || 0),
          teveCancer: false,
          qtdNetosCancer: 0,
          sexo: parseInt(grandchildCount.grandsons) > 0 ? "masculino" : "feminino",
          mesmoPais: true,
          outroCancerList: [],
        },
      ];
    }

    onFormChange({ netosList });
  }, [grandchildren, hasCancer, hasGrandchildren, grandchildCount, onFormChange]);

  const handleAddGrandchild = useCallback(() => {
    setGrandchildren((prevGrandchildren) => [...prevGrandchildren, { sex: "", type: [], showAgeDropdowns: {} }]);
  }, []);

  const handleDeleteGrandchild = useCallback((indexToDelete) => {
    setGrandchildren((prevGrandchildren) => prevGrandchildren.filter((_, index) => index !== indexToDelete));
  }, []);

  const toggleAgeDropdown = useCallback((index, typeId) => {
    setGrandchildren((prevGrandchildren) => {
      const newGrandchildren = [...prevGrandchildren];
      const showAgeDropdowns = newGrandchildren[index].showAgeDropdowns || {};
      showAgeDropdowns[typeId] = !showAgeDropdowns[typeId];
      newGrandchildren[index].showAgeDropdowns = showAgeDropdowns;
      return newGrandchildren;
    });
  }, []);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  return (
    <div className="nn-form-container">
      <div className="question-with-tooltip">
        <label>
          <div className="top-tooltip">
            <div>O(A) Sr(a) tem netos e netas?</div>
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
      </div>

      {hasGrandchildren === true && (
        <>
          <div className="qtd-netos">
            <label>
              Quantidade de neto(s)
              <input
                type="number"
                value={grandchildCount.grandsons}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? ""
                      : Math.max(0, parseInt(e.target.value) || 0);
                  setGrandchildCount((prev) => ({ ...prev, grandsons: value }));
                }}
              />
            </label>
            <label>
              Quantidade de neta(s)
              <input
                type="number"
                value={grandchildCount.granddaughters}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? ""
                      : Math.max(0, parseInt(e.target.value) || 0);
                  setGrandchildCount((prev) => ({ ...prev, granddaughters: value }));
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
                      value={
                        grandchild.sex
                          ? {
                              value: grandchild.sex,
                              label: grandchild.sex === "neto" ? "Neto" : "Neta",
                            }
                          : null
                      }
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
                        const existingTypes = new Set(
                          grandchild.type.map((t) => t.value)
                        );
                        newGrandchildren[index].type = selectedOptions.map((opt) => {
                          if (existingTypes.has(opt.value)) {
                            return grandchild.type.find(
                              (t) => t.value === opt.value
                            );
                          }
                          return {
                            ...opt,
                            age: "",
                          };
                        });
                        setGrandchildren(newGrandchildren);
                      }}
                    />
                  </label>

                  {grandchild.type.map((cancerType, typeIndex) => (
                    <label key={typeIndex} className="nn-idade">
                      <div className="nn">
                        Idade do diagnóstico para ({cancerType.label})
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