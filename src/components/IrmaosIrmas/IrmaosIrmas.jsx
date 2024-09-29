import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./IrmaosIrmas.css";

export default function IrmaosIrmas({ onClose, onAdvance }) {
  const [relationships, setRelationships] = useState([]);
  const [hasCancer, setHasCancer] = useState(null);
  const [cancerDetails, setCancerDetails] = useState([
    { relation: "", type: [], age: "", showAgeDropdown: false }, // Add showAgeDropdown for each sibling
  ]);

  const relationshipLabels = {
    irmaos: "Irmãos",
    irma: "Irmãs",
    meioIrmaosPaterno: "Meio-irmãos (paterno)",
    meioIrmasPaterno: "Meio-irmãs (paterno)",
    meioIrmaosMaterno: "Meio-irmãos (materno)",
    meioIrmasMaterno: "Meio-irmãs (materno)",
    naoPossuoIrmaos: "Não possuo irmãos",
  };

  const handleRelationshipChange = (e) => {
    const { value } = e.target;

    if (value === "naoPossuoIrmaos") {
      setRelationships(["naoPossuoIrmaos"]); // Apenas mantém "Não possuo irmãos"
    } else {
      setRelationships((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev.filter((item) => item !== "naoPossuoIrmaos"), value]
      ); // Remove "Não possuo irmãos" se outras opções forem selecionadas
    }
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([
      ...cancerDetails,
      { relation: "", type: [], age: "", showAgeDropdown: false },
    ]);
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    onClose();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  const handleCancerRadioChange = (value) => {
    setHasCancer(value === "sim");
  };

  const handleQuantityChange = (index, value) => {
    const newDetails = [...cancerDetails];
    const quantityValue = Math.max(0, value); // Ensure non-negative value
    newDetails[index].quantity = quantityValue;
    setCancerDetails(newDetails);
  };

  const handleAgeToggle = (index) => {
    const newDetails = [...cancerDetails];
    newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown; // Toggle for specific sibling
    setCancerDetails(newDetails);
  };

  const handleAgeChange = (index, value) => {
    const newDetails = [...cancerDetails];
    const ageValue = Math.max(0, value); // Ensure non-negative value
    newDetails[index].age = ageValue;
    setCancerDetails(newDetails);
  };

  return (
    <div className="ii-modal-overlay" onClick={onClose}>
      <div className="ii-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ii-form-container">
          <div className="ii-header">
            <h2 className="ii-title">Etapa 1 - Irmãos e Irmãs</h2>
            <button className="ii-close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <label className="ii-possui-irmao">
            <span>O Sr(a) possui irmãos, meio-irmãos ou meio-irmãs?</span>
            <div className="ii-radio-group-first">
              {/* Checkbox inputs for relationships */}
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
                {relationships.map((relation, index) => (
                  <label key={index}>
                    {relationshipLabels[relation]}
                    <input
                      type="number"
                      placeholder="Quantidade"
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      min="0"
                    />
                  </label>
                ))}
                <label>
                  Algum deles foi acometido por algum câncer?
                  <div className="ii-radio-group">
                    <label>
                      <input
                        type="radio"
                        name="hasCancer"
                        value="sim"
                        checked={hasCancer === true}
                        onChange={() => handleCancerRadioChange("sim")}
                      />
                      Sim
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="hasCancer"
                        value="nao"
                        checked={hasCancer === false}
                        onChange={() => handleCancerRadioChange("nao")}
                      />
                      Não
                    </label>
                  </div>
                </label>
                {hasCancer && (
                  <>
                    {cancerDetails.map((detail, index) => (
                      <div key={index}>
                        <label>
                          Parentesco
                          <Select
                            placeholder="Escolha o parentesco"
                            options={relationships.map((r) => ({
                              label: relationshipLabels[r],
                              value: r,
                            }))}
                            value={detail.relation}
                            onChange={(selectedOption) => {
                              const newDetails = [...cancerDetails];
                              newDetails[index].relation = selectedOption;
                              setCancerDetails(newDetails);
                            }}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                          />
                        </label>
                        <label>
                          Tipo de câncer
                          <Select
                            placeholder="Selecione o tipo de câncer"
                            isMulti
                            options={cancerOptions}
                            value={detail.type}
                            onChange={(selectedOptions) => {
                              const newDetails = [...cancerDetails];
                              newDetails[index].type = selectedOptions;
                              setCancerDetails(newDetails);
                            }}
                          />
                        </label>
                        <label className="ii-idade">
                          <div className="ii-idade-div">
                            Idade
                            {detail.showAgeDropdown ? (
                              <Select
                                placeholder="Selecione a idade"
                                options={ageOptions}
                                value={detail.age}
                                onChange={(selectedOption) => {
                                  const newDetails = [...cancerDetails];
                                  newDetails[index].age = selectedOption;
                                  setCancerDetails(newDetails);
                                }}
                              />
                            ) : (
                              <input
                                type="number"
                                value={detail.age}
                                onChange={(e) =>
                                  handleAgeChange(index, Number(e.target.value))
                                }
                                min="0"
                              />
                            )}
                          </div>
                          <button
                            className="btn-naosei"
                            type="button"
                            onClick={() => handleAgeToggle(index)} // Pass index to toggle for specific sibling
                          >
                            {detail.showAgeDropdown
                              ? "Digitar idade"
                              : "Não sei"}
                          </button>
                        </label>
                      </div>
                    ))}
                    <button
                      className="ii-btn-add"
                      onClick={handleAddCancerDetail}
                    >
                      Informar +
                    </button>
                  </>
                )}
              </>
            )}
          <div className="ii-form-buttons">
            <button className="ii-btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="ii-btn-next" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

IrmaosIrmas.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
