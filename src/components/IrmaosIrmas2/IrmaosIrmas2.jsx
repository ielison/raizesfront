import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./IrmaosIrmas2.css";
import DeleteIcon from "../../assets/trash.svg";
import InfoIcon from "../../assets/information-2-fill.svg";

export default function IrmaosIrmas2({ onFormChange }) {
  const [relationships, setRelationships] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("ii_relationships")) || [
        "naoPossuoIrmaos",
      ]
    );
  });

  const [hasCancer, setHasCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("ii_hasCancer")) || false;
  });

  const [siblings, setSiblings] = useState(() => {
    return JSON.parse(localStorage.getItem("ii_siblings")) || [];
  });

  const [tooltipIndex, setTooltipIndex] = useState(null);

  const [siblingQuantities, setSiblingQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem("ii_siblingQuantities")) || {};
  });

  const relationshipLabels = {
    irmaos: "Irmão",
    irma: "Irmã",
    meioIrmaosPaterno: "Meio-irmão (paterno)",
    meioIrmasPaterno: "Meia-irmã (paterno)",
    meioIrmaosMaterno: "Meio-irmão (materno)",
    meioIrmasMaterno: "Meia-irmã (materno)",
    naoPossuoIrmaos: "Não possuo irmãos",
  };

  useEffect(() => {
    localStorage.setItem("ii_relationships", JSON.stringify(relationships));
    localStorage.setItem("ii_hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem("ii_siblings", JSON.stringify(siblings));
    localStorage.setItem(
      "ii_siblingQuantities",
      JSON.stringify(siblingQuantities)
    );

    const temIrmaos = !relationships.includes("naoPossuoIrmaos");
    const qtdIrmaos = Object.values(siblingQuantities).reduce(
      (total, qty) => total + qty,
      0
    );

    let irmaosList = [];

    if (relationships.includes("naoPossuoIrmaos")) {
      irmaosList = [
        {
          id: 0,
          temIrmao: false,
          qtdIrmao: 0,
          teveCancer: false,
          qtdeIrmaosCancer: 0,
          mesmosPais: false,
          sexo: "",
          outroCancerList: [],
        },
      ];
    } else {
      irmaosList = siblings
        .filter((sibling) => sibling.type && sibling.type.length > 0)
        .map((sibling, index) => ({
          id: index,
          temIrmao: temIrmaos,
          qtdIrmao: qtdIrmaos,
          teveCancer: true,
          qtdeIrmaosCancer: siblings.filter((s) => s.type && s.type.length > 0)
            .length,
          mesmosPais: !sibling.relation || !sibling.relation.includes("meio"),
          sexo: getSiblingGender([sibling.relation]),
          outroCancerList: sibling.type
            ? sibling.type.map((tipo) => ({
                id: 0,
                idadeDiagnostico:
                  sibling.ages && sibling.ages[tipo.value]
                    ? typeof sibling.ages[tipo.value] === "object"
                      ? sibling.ages[tipo.value].value
                      : parseInt(sibling.ages[tipo.value])
                    : 0,
                tipoCancer: tipo.label,
              }))
            : [],
        }));

      if (irmaosList.length === 0 && temIrmaos) {
        irmaosList.push({
          id: 0,
          temIrmao: temIrmaos,
          qtdIrmao: qtdIrmaos,
          teveCancer: hasCancer,
          qtdeIrmaosCancer: 0,
          mesmosPais: !relationships.some((rel) => rel.includes("meio")),
          sexo: getSiblingGender(relationships),
          outroCancerList: [],
        });
      }
    }

    onFormChange({ irmaosList });
  }, [relationships, siblings, hasCancer, siblingQuantities, onFormChange]);

  const getSiblingGender = (rels) => {
    if (
      rels.includes("irmaos") ||
      rels.includes("meioIrmaosPaterno") ||
      rels.includes("meioIrmaosMaterno")
    ) {
      return "masculino";
    }
    if (
      rels.includes("irma") ||
      rels.includes("meioIrmasPaterno") ||
      rels.includes("meioIrmasMaterno")
    ) {
      return "feminino";
    }
    return "";
  };

  const handleRelationshipChange = (e) => {
    const { value } = e.target;

    if (value === "naoPossuoIrmaos") {
      setRelationships(["naoPossuoIrmaos"]);
      setSiblings([]);
      setHasCancer(false);
      setSiblingQuantities({});
    } else {
      setRelationships((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value && item !== "naoPossuoIrmaos")
          : [...prev.filter((item) => item !== "naoPossuoIrmaos"), value]
      );
    }
  };

  const handleAddSibling = () => {
    setSiblings([
      ...siblings,
      {
        id: siblings.length,
        relation: "",
        type: [],
        ages: {},
        showAgeDropdowns: {},
      },
    ]);
  };

  const handleDeleteSibling = (index) => {
    const newSiblings = siblings.filter((_, i) => i !== index);
    setSiblings(newSiblings);
  };

  const toggleAgeDropdown = (siblingIndex, cancerType) => {
    const newSiblings = [...siblings];
    newSiblings[siblingIndex].showAgeDropdowns[cancerType] =
      !newSiblings[siblingIndex].showAgeDropdowns[cancerType];
    setSiblings(newSiblings);
  };

  const handleQuantityChange = (relation, value) => {
    setSiblingQuantities((prev) => ({
      ...prev,
      [relation]: value,
    }));
  };

  return (
    <div className="ii-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="ii-form-container">
        <label className="ii-possui-irmao">
          <span>O(A) Sr(a) possui irmão ou irmã?</span>
          <div className="ii-radio-group">
            {Object.entries(relationshipLabels).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name="relationship"
                  value={key}
                  checked={relationships.includes(key)}
                  onChange={handleRelationshipChange}
                />
                {label}
              </label>
            ))}
          </div>
        </label>
        {relationships.length > 0 &&
          !relationships.includes("naoPossuoIrmaos") && (
            <>
              {relationships.map((relation) => (
                <label key={relation}>
                  {relationshipLabels[relation]}
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={siblingQuantities[relation] || ""}
                    onChange={(e) =>
                      handleQuantityChange(relation, Number(e.target.value))
                    }
                    min="0"
                  />
                </label>
              ))}
              <label>
                Algum deles foi acometido por algum câncer ou neoplasia?
                <div className="ii-radio-group yn">
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
                  {siblings.map((sibling, siblingIndex) => (
                    <div key={siblingIndex}>
                      <label>
                        Parentesco
                        <Select
                          options={relationships.map((rel) => ({
                            value: rel,
                            label: relationshipLabels[rel],
                          }))}
                          value={
                            sibling.relation
                              ? {
                                  value: sibling.relation,
                                  label: relationshipLabels[sibling.relation],
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            const newSiblings = [...siblings];
                            newSiblings[siblingIndex].relation =
                              selectedOption.value;
                            setSiblings(newSiblings);
                          }}
                          placeholder="Selecione o parentesco"
                        />
                      </label>
                      <label>
                        Tipo de câncer ou neoplasia
                        <Select
                          isMulti
                          placeholder="Selecione o tipo de câncer"
                          options={cancerOptions}
                          value={sibling.type}
                          onChange={(selectedOptions) => {
                            const newSiblings = [...siblings];
                            newSiblings[siblingIndex].type = selectedOptions;
                            setSiblings(newSiblings);
                          }}
                        />
                      </label>
                      {sibling.type &&
                        sibling.type.map((cancerType, typeIndex) => (
                          <label key={typeIndex} className="ii-idade">
                            <div className="ii-idade-div">
                              Idade do diagnóstico para ({cancerType.label})
                              {sibling.showAgeDropdowns &&
                              sibling.showAgeDropdowns[cancerType.value] ? (
                                <Select
                                  options={ageOptions}
                                  placeholder="Selecione a idade"
                                  value={
                                    sibling.ages &&
                                    sibling.ages[cancerType.value]
                                  }
                                  onChange={(selectedOption) => {
                                    const newSiblings = [...siblings];
                                    if (!newSiblings[siblingIndex].ages) {
                                      newSiblings[siblingIndex].ages = {};
                                    }
                                    newSiblings[siblingIndex].ages[
                                      cancerType.value
                                    ] = selectedOption;
                                    setSiblings(newSiblings);
                                  }}
                                />
                              ) : (
                                <input
                                  type="number"
                                  placeholder="Digite a idade"
                                  value={
                                    (sibling.ages &&
                                      sibling.ages[cancerType.value]) ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const newSiblings = [...siblings];
                                    if (!newSiblings[siblingIndex].ages) {
                                      newSiblings[siblingIndex].ages = {};
                                    }
                                    newSiblings[siblingIndex].ages[
                                      cancerType.value
                                    ] = value >= 0 ? value : 0;
                                    setSiblings(newSiblings);
                                  }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                toggleAgeDropdown(
                                  siblingIndex,
                                  cancerType.value
                                )
                              }
                            >
                              {sibling.showAgeDropdowns &&
                              sibling.showAgeDropdowns[cancerType.value]
                                ? "Digitar idade"
                                : "Não sei"}
                            </button>
                            <img
                              src={InfoIcon}
                              alt="Info"
                              className="info-icon-idade"
                              onClick={() =>
                                setTooltipIndex(
                                  tooltipIndex ===
                                    `${siblingIndex}-${typeIndex}`
                                    ? null
                                    : `${siblingIndex}-${typeIndex}`
                                )
                              }
                            />
                            {tooltipIndex ===
                              `${siblingIndex}-${typeIndex}` && (
                              <div className="tooltip-idade-ii">
                                Caso seu paciente não saiba a idade exata do
                                diagnóstico de câncer em um familiar, questione
                                se foi antes ou depois dos 50 anos. Essa
                                estimativa é mais fácil de lembrar e ainda
                                oferece um corte de idade útil para a avaliação
                                de risco.
                              </div>
                            )}
                          </label>
                        ))}
                      <button
                        type="button"
                        onClick={() => handleDeleteSibling(siblingIndex)}
                        className="ii-btn-delete"
                      >
                        <img src={DeleteIcon} alt="Deletar" />
                      </button>
                    </div>
                  ))}
                  <button className="ii-btn-add" onClick={handleAddSibling}>
                    Informar +
                  </button>
                </>
              )}
            </>
          )}
      </div>
    </div>
  );
}

IrmaosIrmas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};