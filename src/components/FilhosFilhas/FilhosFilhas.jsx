import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions"; // Import ageOptions
import "./FilhosFilhas.css";

export default function FilhosFilhas({ onAdvance, onBack }) {
  const [hasChildren, setHasChildren] = useState(null); // Changed to null
  const [hasCancer, setHasCancer] = useState(false); // Default to 'Não'
  const [children, setChildren] = useState([]); // Initialize as an empty array
  
  const handleAddChild = () => {
    setChildren([...children, { sex: "", type: [], age: "", showAgeDropdown: false }]); // Add new child with showAgeDropdown
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack(); // Call the onBack callback if provided
    } else {
      console.warn("onBack function is not provided!");
    }
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  const toggleAgeDropdown = (index) => {
    const newChildren = [...children];
    newChildren[index].showAgeDropdown = !newChildren[index].showAgeDropdown; // Toggle the specific child's showAgeDropdown state
    setChildren(newChildren);
  };

  return (
    <div className="ff-modal-overlay">
      <div
        className="modal-content-filhos__filhas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ff-form-container">
          <div className="dp-form-top">
            <h2>Etapa 1 - Filhos e Filhas</h2>
            <button className="dp-close-button" onClick={handleBackClick}>
              &times;
            </button>
          </div>
          <label>
            O Sr(a) tem filhos e filhas?
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

          {hasChildren && (
            <>
              <div className="qtd-filhos">
                <label>
                  Quantidade de filhos
                  <input
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      e.target.value = value >= 0 ? value : 0;
                    }}
                  />
                </label>
                <label>
                  Quantidade de filhas
                  <input
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      e.target.value = value >= 0 ? value : 0;
                    }}
                  />
                </label>
              </div>

              <label>
                Algum deles já teve câncer?
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
                        Sexo
                        <Select
                          options={[
                            { value: "masculino", label: "Masculino" },
                            { value: "feminino", label: "Feminino" },
                          ]}
                          onChange={(selectedOption) => {
                            const newChildren = [...children];
                            newChildren[index].sex = selectedOption.value; // Set the sex of the child
                            setChildren(newChildren);
                          }}
                          placeholder="Selecione o sexo"
                        />
                      </label>
                      <label>
                        Tipo de câncer
                        <Select
                          isMulti
                          placeholder="Selecione o tipo de câncer"
                          options={cancerOptions}
                          value={child.type}
                          onChange={(selectedOptions) => {
                            const newChildren = [...children];
                            newChildren[index].type = selectedOptions;
                            setChildren(newChildren);
                          }}
                        />
                      </label>
                      <label className="ff-idade">
                        <div className="ff">
                          Idade
                          {child.showAgeDropdown ? ( // Use the child's showAgeDropdown state
                            <Select
                              placeholder="Selecione..."
                              options={ageOptions}
                              value={child.age}
                              onChange={(selectedOption) => {
                                const newChildren = [...children];
                                newChildren[index].age = selectedOption; // Set the age of the child
                                setChildren(newChildren);
                              }}
                            />
                          ) : (
                            <input
                              type="number"
                              value={child.age}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newChildren = [...children];
                                newChildren[index].age = value >= 0 ? value : 0; // Validation to prevent negative values
                                setChildren(newChildren);
                              }}
                            />
                          )}
                        </div>
                        <button type="button" onClick={() => toggleAgeDropdown(index)}>
                          {child.showAgeDropdown ? "Digitar idade" : "Não sei"}
                        </button>
                      </label>
                    </div>
                  ))}
                  <button className="ff-btn-add" onClick={handleAddChild}>
                    Informar +
                  </button>
                </>
              )}
            </>
          )}

          <div className="ff-form-buttons">
            <button className="ff-btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="ff-btn-next" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

FilhosFilhas.propTypes = {
  onAdvance: PropTypes.func.isRequired,
  onBack: PropTypes.func, // Optional onBack prop
};
