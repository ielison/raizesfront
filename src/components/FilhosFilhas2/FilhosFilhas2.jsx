"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import "./FilhosFilhas2.css";

export default function FilhosFilhas2({ onFormChange }) {
  const [hasChildren, setHasChildren] = useState(() => {
    return JSON.parse(localStorage.getItem("hasChildren")) || false;
  });

  const [hasCancer, setHasCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("hasCancer")) || false;
  });

  const [childCount, setChildCount] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("childCount")) || {
        sons: 0,
        daughters: 0,
      }
    );
  });

  const [children, setChildren] = useState(() => {
    return JSON.parse(localStorage.getItem("children")) || [];
  });

  const [tooltipIndex, setTooltipIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("hasChildren", JSON.stringify(hasChildren));
    localStorage.setItem("hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem("childCount", JSON.stringify(childCount));
    localStorage.setItem("children", JSON.stringify(children));

    let filhosList;

    if (hasChildren === false) {
      filhosList = [
        {
          id: 0,
          temFilhos: false,
          qtdFilhos: 0,
          teveCancer: false,
          qtdFilhosCancer: 0,
          sexo: "",
          mesmoPais: true,
          outroCancerList: [],
        },
      ];
    } else if (hasCancer) {
      filhosList = children.map((child, index) => ({
        id: index,
        temFilhos: true,
        qtdFilhos: childCount.sons + childCount.daughters,
        teveCancer: true,
        qtdFilhosCancer: children.filter((c) => c.type.length > 0).length,
        sexo: child.sex === "filho" ? "masculino" : "feminino",
        mesmoPais: true,
        outroCancerList: child.type.map((opt, idx) => ({
          id: idx,
          idadeDiagnostico: opt.age?.value || opt.age || 0,
          tipoCancer: opt.label,
        })),
      }));
    } else {
      filhosList = [
        {
          id: 0,
          temFilhos: true,
          qtdFilhos: childCount.sons + childCount.daughters,
          teveCancer: false,
          qtdFilhosCancer: 0,
          sexo: childCount.sons > 0 ? "masculino" : "feminino",
          mesmoPais: true,
          outroCancerList: [],
        },
      ];
    }

    onFormChange({ filhosList });
  }, [children, hasCancer, hasChildren, childCount, onFormChange]);

  const handleAddChild = () => {
    setChildren([...children, { sex: "", type: [], showAgeDropdowns: {} }]);
  };

  const handleDeleteChild = (indexToDelete) => {
    setChildren(children.filter((_, index) => index !== indexToDelete));
  };

  const toggleAgeDropdown = (index, typeId) => {
    const newChildren = [...children];
    const showAgeDropdowns = newChildren[index].showAgeDropdowns || {};
    showAgeDropdowns[typeId] = !showAgeDropdowns[typeId];
    newChildren[index].showAgeDropdowns = showAgeDropdowns;
    setChildren(newChildren);
  };

  return (
    <div className="ff-form-container">
      <label>
        O(A) Sr(a) tem filhos e filhas?
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="hasChildren"
              value="sim"
              checked={hasChildren === true}
              onChange={() => setHasChildren(true)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasChildren"
              value="nao"
              checked={hasChildren === false}
              onChange={() => setHasChildren(false)}
            />
            Não
          </label>
        </div>
      </label>

      {hasChildren === true && (
        <>
          <div className="qtd-filhos">
            <label>
              Quantidade de filho(s)
              <input
                type="number"
                value={childCount.sons}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setChildCount((prev) => ({ ...prev, sons: value }));
                }}
              />
            </label>
            <label>
              Quantidade de filha(s)
              <input
                type="number"
                value={childCount.daughters}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setChildCount((prev) => ({ ...prev, daughters: value }));
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
              {children.map((child, index) => (
                <div key={index} className="child-container">
                  <label>
                    Parentesco
                    <Select
                      options={[
                        { value: "filho", label: "Filho" },
                        { value: "filha", label: "Filha" },
                      ]}
                      onChange={(selectedOption) => {
                        const newChildren = [...children];
                        newChildren[index].sex = selectedOption.value;
                        setChildren(newChildren);
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
                      value={child.type}
                      onChange={(selectedOptions) => {
                        const newChildren = [...children];
                        newChildren[index].type = selectedOptions.map(
                          (opt) => ({
                            ...opt,
                            age: "",
                          })
                        );
                        setChildren(newChildren);
                      }}
                    />
                  </label>

                  {child.type.map((cancerType, typeIndex) => (
                    <label key={typeIndex} className="ff-idade">
                      <div className="ff">
                        Idade do diagnóstico ({cancerType.label})
                        {child.showAgeDropdowns?.[cancerType.value] ? (
                          <Select
                            placeholder="Selecione..."
                            options={ageOptions}
                            value={cancerType.age}
                            onChange={(selectedOption) => {
                              const newChildren = [...children];
                              newChildren[index].type[typeIndex].age =
                                selectedOption;
                              setChildren(newChildren);
                            }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={cancerType.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newChildren = [...children];
                              newChildren[index].type[typeIndex].age =
                                value >= 0 ? value : 0;
                              setChildren(newChildren);
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
                        {child.showAgeDropdowns?.[cancerType.value]
                          ? "Digitar idade"
                          : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        }
                      />

                      {tooltipIndex === index && (
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  ))}

                  <button
                    className="ff-btn-delete"
                    type="button"
                    onClick={() => handleDeleteChild(index)}
                  >
                    <img src={DeleteIcon} alt="Deletar" />
                  </button>
                </div>
              ))}
              <button className="ff-btn-add" onClick={handleAddChild}>
                Informar +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

FilhosFilhas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
