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
    return JSON.parse(localStorage.getItem("relationships")) || ["naoPossuoIrmaos"];
  });

  const [hasCancer, setHasCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("hasCancer")) || false;
  });

  const [siblings, setSiblings] = useState(() => {
    return JSON.parse(localStorage.getItem("siblings")) || [];
  });

  const [tooltipIndex, setTooltipIndex] = useState(null);

  const relationshipLabels = {
    irmaos: "Irmão",
    irma: "Irmã",
    meioIrmaosPaterno: "Meios-irmão (paterno)",
    meioIrmasPaterno: "Meios-irmã (paterno)",
    meioIrmaosMaterno: "Meios-irmão (materno)",
    meioIrmasMaterno: "Meios-irmã (materno)",
    naoPossuoIrmaos: "Não possuo irmãos",
  };

  useEffect(() => {
    localStorage.setItem("relationships", JSON.stringify(relationships));
    localStorage.setItem("hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem("siblings", JSON.stringify(siblings));

    const irmaosList = [
      {
        id: 0,
        temIrmao: relationships.length > 0 && !relationships.includes("naoPossuoIrmaos"),
        qtdIrmao: relationships.reduce(
          (sum, rel) => sum + (siblings.find((s) => s.relation === rel)?.quantity || 0),
          0
        ),
        teveCancer: hasCancer,
        qtdeIrmaosCancer: siblings.filter((s) => s.type && s.type.length > 0).length,
        mesmosPais: false,
        sexo: getSiblingGender(relationships),
        outroCancerList: siblings.flatMap((sibling) =>
          (sibling.type || []).map((tipo) => ({
            id: 0,
            idadeDiagnostico: sibling.age
              ? typeof sibling.age === "object"
                ? sibling.age.value
                : parseInt(sibling.age)
              : 0,
            tipoCancer: tipo.label,
          }))
        ),
      },
    ];

    onFormChange({ irmaosList });
  }, [relationships, siblings, hasCancer, onFormChange]);

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
        age: "",
        showAgeDropdown: false,
        quantity: 1,
      },
    ]);
  };

  const handleDeleteSibling = (index) => {
    const newSiblings = siblings.filter((_, i) => i !== index);
    setSiblings(newSiblings);
  };

  const toggleAgeDropdown = (index) => {
    const newSiblings = [...siblings];
    newSiblings[index].showAgeDropdown = !newSiblings[index].showAgeDropdown;
    newSiblings[index].age = "";
    setSiblings(newSiblings);
  };

  const handleQuantityChange = (relation, value) => {
    const siblingIndex = siblings.findIndex((s) => s.relation === relation);
    if (siblingIndex !== -1) {
      const newSiblings = [...siblings];
      newSiblings[siblingIndex].quantity = value;
      setSiblings(newSiblings);
    } else {
      setSiblings([
        ...siblings,
        { relation, quantity: value, type: [], age: "" },
      ]);
    }
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
                    onChange={(e) =>
                      handleQuantityChange(relation, Number(e.target.value))
                    }
                    min="0"
                  />
                </label>
              ))}
              <label>
                Algum deles foi acometido por algum câncer ou neoplasia?
                <div className="ii-radio-group">
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
                  {siblings.map((sibling, index) => (
                    <div key={index}>
                      <label>
                        Parentesco
                        <Select
                          options={relationships.map((rel) => ({
                            value: rel,
                            label: relationshipLabels[rel],
                          }))}
                          onChange={(selectedOption) => {
                            const newSiblings = [...siblings];
                            newSiblings[index].relation = selectedOption.value;
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
                            newSiblings[index].type = selectedOptions;
                            setSiblings(newSiblings);
                          }}
                        />
                      </label>
                      <label className="ii-idade">
                        <div className="ii-idade-div">
                          Idade do diagnóstico
                          {sibling.showAgeDropdown ? (
                            <Select
                              options={ageOptions}
                              placeholder="Selecione a idade"
                              value={sibling.age}
                              onChange={(selectedOption) => {
                                const newSiblings = [...siblings];
                                newSiblings[index].age = selectedOption;
                                setSiblings(newSiblings);
                              }}
                            />
                          ) : (
                            <input
                              type="number"
                              placeholder="Digite a idade"
                              value={sibling.age}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newSiblings = [...siblings];
                                newSiblings[index].age = value >= 0 ? value : 0;
                                setSiblings(newSiblings);
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAgeDropdown(index)}
                        >
                          {sibling.showAgeDropdown
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
                          }
                        />
                        {tooltipIndex === index && (
                          <div className="tooltip-idade-ii">
                            Caso seu paciente não saiba a idade exata do
                            diagnóstico de câncer em um familiar, questione se
                            foi antes ou depois dos 50 anos. Essa estimativa é
                            mais fácil de lembrar e ainda oferece um corte de
                            idade útil para a avaliação de risco.
                          </div>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteSibling(index)}
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
