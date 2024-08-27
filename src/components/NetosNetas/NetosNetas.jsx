import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./NetosNetas.css";

export default function NetosNetas({ onClose, onAdvance }) {
  const [hasGrandchildren, setHasGrandchildren] = useState(null); // null to handle both "Sim" and "Não"
  const [hasCancer, setHasCancer] = useState(null); // null to handle both "Sim" and "Não"
  const [grandchildren, setGrandchildren] = useState([{ type: "", age: "" }]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleAddGrandchild = () => {
    setGrandchildren([...grandchildren, { type: "", age: "" }]);
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

  const handleGrandchildrenRadioChange = (value) => {
    setHasGrandchildren(value === "sim");
  };

  const handleCancerRadioChange = (value) => {
    setHasCancer(value === "sim");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-netos__netas"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar activeEtapa="etapa1" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 1 - Netos e Netas</h2>
          <label>
            O Sr(a) tem netos e netas?
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="hasGrandchildren"
                  checked={hasGrandchildren === true}
                  onChange={() => handleGrandchildrenRadioChange("sim")}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="hasGrandchildren"
                  checked={hasGrandchildren === false}
                  onChange={() => handleGrandchildrenRadioChange("nao")}
                />
                Não
              </label>
            </div>
          </label>
          {hasGrandchildren && (
            <>
              <label>
                Quantidade de netos
                <input type="number" />
              </label>
              <label>
                Quantidade de netas
                <input type="number" />
              </label>
              <label>
                Algum deles já teve câncer?
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="hasCancer"
                      checked={hasCancer === true}
                      onChange={() => handleCancerRadioChange("sim")}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasCancer"
                      checked={hasCancer === false}
                      onChange={() => handleCancerRadioChange("nao")}
                    />
                    Não
                  </label>
                </div>
              </label>
              {hasCancer === true && (
                <>
                  <label>
                    Quantidade de netos com câncer
                    <input type="number" />
                  </label>
                  <label>
                    Quantidade de netas com câncer
                    <input type="number" />
                  </label>
                  {grandchildren.map((grandchild, index) => (
                    <div key={index}>
                      <label>Neto {index + 1}</label>
                      <label>
                        Tipo de câncer
                        <Select
                          options={cancerOptions}
                          value={grandchild.type}
                          onChange={(selectedOption) => {
                            const newGrandchildren = [...grandchildren];
                            newGrandchildren[index].type = selectedOption;
                            setGrandchildren(newGrandchildren);
                          }}
                        />
                      </label>
                      <label className="nn-idade">
                        <div className="nn">
                          Idade
                          {showAgeDropdown ? (
                            <Select
                              options={ageOptions}
                              value={grandchild.age}
                              onChange={(selectedOption) => {
                                const newGrandchildren = [...grandchildren];
                                newGrandchildren[index].age = selectedOption;
                                setGrandchildren(newGrandchildren);
                              }}
                            />
                          ) : (
                            <input
                              type="number"
                              value={grandchild.age}
                              onChange={(e) => {
                                const newGrandchildren = [...grandchildren];
                                newGrandchildren[index].age = e.target.value;
                                setGrandchildren(newGrandchildren);
                              }}
                            />
                          )}
                        </div>
                        <button type="button" onClick={handleAgeToggle}>
                          {showAgeDropdown ? "Digitar idade" : "Não sei"}
                        </button>
                      </label>
                    </div>
                  ))}
                  <button className="nn-btn-add" onClick={handleAddGrandchild}>
                    Informar +
                  </button>
                </>
              )}
            </>
          )}
          <div className="nn-form-buttons">
            <button className="nn-btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="nn-btn-next" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

NetosNetas.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
