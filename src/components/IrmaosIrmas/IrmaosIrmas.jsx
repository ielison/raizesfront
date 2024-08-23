import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./IrmaosIrmas.css";

export default function IrmaosIrmas({ onClose, onAdvance }) {
  const [relationships, setRelationships] = useState([]);
  const [hasCancer, setHasCancer] = useState(null); // null to handle both "Sim" and "Não"
  const [cancerDetails, setCancerDetails] = useState([{ relation: "", type: [], age: "" }]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleRelationshipChange = (e) => {
    const { value, checked } = e.target;

    if (value === "naoPossuoIrmaos") {
      setRelationships([]);
    } else {
      setRelationships((prev) => 
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    }
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([...cancerDetails, { relation: "", type: [], age: "" }]);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleBackClick = () => {
    console.log("Back button clicked"); // Log when the back button is clicked
    onClose();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked"); // Log when the advance button is clicked
    onAdvance();
  };

  const handleCancerCheckboxChange = (value) => {
    setHasCancer(value === "sim");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-irmaos__irmas" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa1" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 1 - Irmãos e Irmãs</h2>
          <label>
            O Sr(a) possui irmãos, meio-irmãos ou meio-irmãs?
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="irmaos"
                  checked={relationships.includes("irmaos")}
                  onChange={handleRelationshipChange}
                />
                Irmãos
              </label>
              <label>
                <input
                  type="checkbox"
                  value="irma"
                  checked={relationships.includes("irma")}
                  onChange={handleRelationshipChange}
                />
                Irmãs
              </label>
              <label>
                <input
                  type="checkbox"
                  value="meioIrmaosPaterno"
                  checked={relationships.includes("meioIrmaosPaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãos (paterno)
              </label>
              <label>
                <input
                  type="checkbox"
                  value="meioIrmasPaterno"
                  checked={relationships.includes("meioIrmasPaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãs (paterno)
              </label>
              <label>
                <input
                  type="checkbox"
                  value="meioIrmaosMaterno"
                  checked={relationships.includes("meioIrmaosMaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãos (materno)
              </label>
              <label>
                <input
                  type="checkbox"
                  value="meioIrmasMaterno"
                  checked={relationships.includes("meioIrmasMaterno")}
                  onChange={handleRelationshipChange}
                />
                Meio-irmãs (materno)
              </label>
              <label>
                <input
                  type="checkbox"
                  value="naoPossuoIrmaos"
                  checked={relationships.includes("naoPossuoIrmaos")}
                  onChange={handleRelationshipChange}
                />
                Não possuo irmãos
              </label>
            </div>
          </label>
          {relationships.length > 0 && !relationships.includes("naoPossuoIrmaos") && (
            <>
              {relationships.map((relation, index) => (
                <label key={index}>
                  {relation.charAt(0).toUpperCase() + relation.slice(1).replace(/([A-Z])/g, ' $1')}
                  <input
                    type="number"
                    placeholder="Quantidade"
                  />
                </label>
              ))}
              <label>
                Algum deles foi acometido por algum câncer?
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="sim"
                      checked={hasCancer === true}
                      onChange={() => handleCancerCheckboxChange("sim")}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="nao"
                      checked={hasCancer === false}
                      onChange={() => handleCancerCheckboxChange("nao")}
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
                          options={relationships.map(r => ({ label: r, value: r }))}
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
                      <label>
                        Idade
                        {showAgeDropdown ? (
                          <Select
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
                        <button type="button" onClick={handleAgeToggle}>
                          {showAgeDropdown ? "Digitar idade" : "Não sei"}
                        </button>
                      </label>
                    </div>
                  ))}
                  <button onClick={handleAddCancerDetail}>Informar +</button>
                </>
              )}
            </>
          )}
          <div className="form-buttons">
            <button className="btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="btn-next" onClick={handleAdvanceClick}>
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
