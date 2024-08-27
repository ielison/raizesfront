import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./IrmaosIrmas.css";

export default function IrmaosIrmas({ onClose, onAdvance }) {
  const [relationships, setRelationships] = useState([]);
  const [hasCancer, setHasCancer] = useState(null);
  const [cancerDetails, setCancerDetails] = useState([
    { relation: "", type: [], age: "" },
  ]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleRelationshipChange = (e) => {
    const { value } = e.target;
    setRelationships([value]);
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([...cancerDetails, { relation: "", type: [], age: "" }]);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
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

  return (
    <div className="ii-modal-overlay" onClick={onClose}>
      <div className="ii-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa1" />
        <div className="ii-form-container">
          <div className="ii-header">
            <h2>Etapa 1 - Irmãos e Irmãs</h2>
            <button className="ii-close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <label className="ii-possui-irmao">
            <span>O Sr(a) possui irmãos, meio-irmãos ou meio-irmãs?</span>
            <div className="ii-radio-group-first">
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="irmaos"
                  checked={relationships.includes("irmaos")}
                  onChange={handleRelationshipChange}
                />
                Irmãos
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="irma"
                  checked={relationships.includes("irma")}
                  onChange={handleRelationshipChange}
                />
                Irmãs
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="meioIrmaosPaterno"
                  checked={relationships.includes("meioIrmaosPaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãos (paterno)
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="meioIrmasPaterno"
                  checked={relationships.includes("meioIrmasPaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãs (paterno)
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="meioIrmaosMaterno"
                  checked={relationships.includes("meioIrmaosMaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãos (materno)
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="meioIrmasMaterno"
                  checked={relationships.includes("meioIrmasMaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãs (materno)
              </label>
              <label>
                <input
                  type="radio"
                  name="relationship"
                  value="naoPossuoIrmaos"
                  checked={relationships.includes("naoPossuoIrmaos")}
                  onChange={handleRelationshipChange}
                />
                Não possuo irmãos
              </label>
            </div>
          </label>
          {relationships.length > 0 &&
            !relationships.includes("naoPossuoIrmaos") && (
              <>
                {relationships.map((relation, index) => (
                  <label key={index}>
                    {relation.charAt(0).toUpperCase() +
                      relation.slice(1).replace(/([A-Z])/g, " $1")}
                    <input type="number" placeholder="Quantidade" />
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
                              label: r,
                              value: r,
                            }))}
                            value={detail.relation}
                            onChange={(selectedOption) => {
                              const newDetails = [...cancerDetails];
                              newDetails[index].relation = selectedOption;
                              setCancerDetails(newDetails);
                            }}
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
                            {showAgeDropdown ? (
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
                                onChange={(e) => {
                                  const newDetails = [...cancerDetails];
                                  newDetails[index].age = e.target.value;
                                  setCancerDetails(newDetails);
                                }}
                              />
                            )}
                          </div>
                          <button
                            className="btn-naosei"
                            type="button"
                            onClick={handleAgeToggle}
                          >
                            {showAgeDropdown ? "Digitar idade" : "Não sei"}
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
