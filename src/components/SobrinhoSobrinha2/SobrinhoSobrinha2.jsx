import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./SobrinhoSobrinha2.css";
import DeleteIcon from "../../assets/trash.svg";
import InfoIcon from "../../assets/information-2-fill.svg";

export default function SobrinhosSobrinhas2({ onFormChange }) {
  const [relationships, setRelationships] = useState(() => {
    return JSON.parse(localStorage.getItem("ss_relationships")) || ["naoPossuoSobrinhos"];
  });

  const [hasCancer, setHasCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("ss_hasCancer")) || false;
  });

  const [siblings, setSiblings] = useState(() => {
    return JSON.parse(localStorage.getItem("ss_siblings")) || [];
  });

  const [tooltipIndex, setTooltipIndex] = useState(null);

  const [siblingQuantities, setSiblingQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem("ss_siblingQuantities")) || {};
  });

  const relationshipLabels = {
    sobrinhos: "Sobrinho",
    sobrinhas: "Sobrinha",
    meioSobrinhos: "Meio-sobrinho",
    meiaSobrinhas: "Meia-sobrinha",
    naoPossuoSobrinhos: "Não possuo sobrinho",
  };

  useEffect(() => {
    localStorage.setItem("ss_relationships", JSON.stringify(relationships));
    localStorage.setItem("ss_hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem("ss_siblings", JSON.stringify(siblings));
    localStorage.setItem("ss_siblingQuantities", JSON.stringify(siblingQuantities));

    const temSobrinhos = !relationships.includes("naoPossuoSobrinhos");
    const qtdSobrinhos = Object.values(siblingQuantities).reduce((total, qty) => total + qty, 0);

    let sobrinhosList = [];

    if (relationships.includes("naoPossuoSobrinhos")) {
      sobrinhosList = [
        {
          id: 0,
          temSobrinhos: false,
          qtdSobrinhos: 0,
          teveCancer: false,
          qtdSobrinhosCancer: 0,
          meioSobrinho: false,
          sexo: "",
          outroCancerList: [],
        },
      ];
    } else {
      sobrinhosList = siblings
        .filter((sibling) => sibling.type && sibling.type.length > 0)
        .map((sibling, index) => ({
          id: index,
          temSobrinhos: temSobrinhos,
          qtdSobrinhos: qtdSobrinhos,
          teveCancer: true,
          qtdSobrinhosCancer: siblings.filter((s) => s.type && s.type.length > 0).length,
          meioSobrinho: sibling.relation && sibling.relation.includes("meio"),
          sexo:
            (sibling.relation && sibling.relation.includes("sobrinhos")) ||
            (sibling.relation && sibling.relation.includes("meioSobrinhos"))
              ? "masculino"
              : "feminino",
          outroCancerList: sibling.type
            ? sibling.type.map((tipo) => ({
                id: 0,
                idadeDiagnostico: sibling.ages && sibling.ages[tipo.value]
                  ? typeof sibling.ages[tipo.value] === "object"
                    ? sibling.ages[tipo.value].value
                    : parseInt(sibling.ages[tipo.value])
                  : 0,
                tipoCancer: tipo.label,
              }))
            : [],
        }));

      if (sobrinhosList.length === 0 && temSobrinhos) {
        sobrinhosList.push({
          id: 0,
          temSobrinhos: temSobrinhos,
          qtdSobrinhos: qtdSobrinhos,
          teveCancer: hasCancer,
          qtdSobrinhosCancer: 0,
          meioSobrinho:
            relationships.includes("meioSobrinhos") ||
            relationships.includes("meiaSobrinhas"),
          sexo:
            relationships.includes("sobrinhos") ||
            relationships.includes("meioSobrinhos")
              ? "masculino"
              : relationships.includes("sobrinhas") ||
                relationships.includes("meiaSobrinhas")
              ? "feminino"
              : "",
          outroCancerList: [],
        });
      }
    }

    onFormChange({ sobrinhosList });
  }, [relationships, siblings, hasCancer, siblingQuantities, onFormChange]);

  const handleRelationshipChange = (e) => {
    const { value } = e.target;

    if (value === "naoPossuoSobrinhos") {
      setRelationships(["naoPossuoSobrinhos"]);
      setSiblings([]);
      setHasCancer(false);
      setSiblingQuantities({});
    } else {
      setRelationships((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev.filter((item) => item !== "naoPossuoSobrinhos"), value]
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
    <div className="ss-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="ss-form-container">
        <label className="ss-possui-sobrinho">
          <span>O(A) Sr(a) possui sobrinho ou meio-sobrinho?</span>
          <div className="ss-radio-group">
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
          !relationships.includes("naoPossuoSobrinhos") && (
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
                <div className="ss-radio-group">
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
                      {sibling.type.map((cancerType, typeIndex) => (
                        <label key={typeIndex} className="ss-idade">
                          <div className="ss-idade-div">
                            Idade do diagnóstico para {cancerType.label}
                            {sibling.showAgeDropdowns[cancerType.value] ? (
                              <Select
                                options={ageOptions}
                                placeholder="Selecione a idade"
                                value={sibling.ages[cancerType.value]}
                                onChange={(selectedOption) => {
                                  const newSiblings = [...siblings];
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
                                value={sibling.ages[cancerType.value] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const newSiblings = [...siblings];
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
                              toggleAgeDropdown(siblingIndex, cancerType.value)
                            }
                          >
                            {sibling.showAgeDropdowns[cancerType.value]
                              ? "Digitar idade"
                              : "Não sei"}
                          </button>
                          <img
                            src={InfoIcon}
                            alt="Info"
                            className="info-icon-idade"
                            onClick={() =>
                              setTooltipIndex(
                                tooltipIndex === `${siblingIndex}-${typeIndex}`
                                  ? null
                                  : `${siblingIndex}-${typeIndex}`
                              )
                            }
                          />
                          {tooltipIndex === `${siblingIndex}-${typeIndex}` && (
                            <div className="tooltip-idade-ss">
                              Caso seu paciente não saiba a idade exata do
                              diagnóstico de câncer em um familiar, questione se
                              foi antes ou depois dos 50 anos. Essa estimativa é
                              mais fácil de lembrar e ainda oferece um corte de
                              idade útil para a avaliação de risco.
                            </div>
                          )}
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleDeleteSibling(siblingIndex)}
                        className="ss-btn-delete"
                      >
                        <img src={DeleteIcon} alt="Deletar" />
                      </button>
                    </div>
                  ))}
                  <button className="ss-btn-add" onClick={handleAddSibling}>
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

SobrinhosSobrinhas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
