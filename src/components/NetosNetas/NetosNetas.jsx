import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./NetosNetas.css";

export default function NetosNetas({ onClose, onAdvance }) {
  const [hasGrandchildren, setHasGrandchildren] = useState(null);
  const [hasCancer, setHasCancer] = useState(false);
  const [grandchildren, setGrandchildren] = useState([]);

  const handleAddGrandchild = () => {
    setGrandchildren([...grandchildren, { sex: "", type: [], age: "", showAgeDropdown: false }]);
  };

  const handleBackClick = () => {
    onClose(); // Close the modal when the back button is clicked
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  const toggleAgeDropdown = (index) => {
    const newGrandchildren = [...grandchildren];
    newGrandchildren[index].showAgeDropdown = !newGrandchildren[index].showAgeDropdown;
    setGrandchildren(newGrandchildren);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-netos__netas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nn-form-container">
          <div className="dp-form-top">
            <h2>Etapa 1 - Netos e Netas</h2>
            <button className="dp-close-button" onClick={handleBackClick}>
              &times;
            </button>
          </div>

          <label>
            O Sr(a) tem netos e netas?
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="hasGrandchildren"
                  checked={hasGrandchildren === true}
                  onChange={() => setHasGrandchildren(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="hasGrandchildren"
                  checked={hasGrandchildren === false}
                  onChange={() => setHasGrandchildren(false)}
                />
                Não
              </label>
            </div>
          </label>

          {hasGrandchildren && (
            <>
              <div className="qtd-netos-netas">
                <label>
                  Quantidade de netos
                  <input
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      e.target.value = value >= 0 ? value : 0; // Prevent negative values
                    }}
                  />
                </label>
                <label>
                  Quantidade de netas
                  <input
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      e.target.value = value >= 0 ? value : 0; // Prevent negative values
                    }}
                  />
                </label>
              </div>

              <label>
                Algum deles já teve câncer?
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="hasCancer"
                      checked={hasCancer === true}
                      onChange={() => setHasCancer(true)}
                    />
                    Sim
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasCancer"
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
                        Sexo
                        <Select
                          options={[
                            { value: "masculino", label: "Masculino" },
                            { value: "feminino", label: "Feminino" },
                          ]}
                          onChange={(selectedOption) => {
                            const newGrandchildren = [...grandchildren];
                            newGrandchildren[index].sex = selectedOption.value; // Set the sex of the grandchild
                            setGrandchildren(newGrandchildren);
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
                          value={grandchild.type}
                          onChange={(selectedOptions) => {
                            const newGrandchildren = [...grandchildren];
                            newGrandchildren[index].type = selectedOptions; // Set the cancer type
                            setGrandchildren(newGrandchildren);
                          }}
                        />
                      </label>
                      <label className="nn-idade">
                        <div className="nn">
                          Idade
                          {grandchild.showAgeDropdown ? (
                            <Select
                              placeholder="Selecione..."
                              options={ageOptions}
                              value={grandchild.age}
                              onChange={(selectedOption) => {
                                const newGrandchildren = [...grandchildren];
                                newGrandchildren[index].age = selectedOption; // Set the age of the grandchild
                                setGrandchildren(newGrandchildren);
                              }}
                            />
                          ) : (
                            <input
                              type="number"
                              value={grandchild.age}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newGrandchildren = [...grandchildren];
                                newGrandchildren[index].age = value >= 0 ? value : 0; // Prevent negative values
                                setGrandchildren(newGrandchildren);
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAgeDropdown(index)}
                        >
                          {grandchild.showAgeDropdown ? "Digitar idade" : "Não sei"}
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
