import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions"; // Importe ageOptions
import Sidebar from "../Sidebar/Sidebar";
import "./FilhosFilhas.css";

export default function FilhosFilhas({ onAdvance, onBack }) {
  const [hasChildren, setHasChildren] = useState(null); // Alterado para null
  const [hasCancer, setHasCancer] = useState(false); // 'Não' marcado por padrão
  const [children, setChildren] = useState([{ type: [], age: "" }]); // type como array para múltiplos tipos de câncer
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleAddChild = () => {
    setChildren([...children, { type: [], age: "" }]); // type como array para múltiplos tipos de câncer
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack(); // Chama a função de callback onBack se fornecida
    } else {
      console.warn("onBack function is not provided!");
    }
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  return (
    <div className="ff-modal-overlay">
      <div
        className="modal-content-filhos__filhas"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar activeEtapa="etapa1" />
        <div className="ff-form-container">
          <button className="close-button" onClick={handleBackClick}>
            &times;
          </button>
          <h2>Etapa 1 - Filhos e Filhas</h2>

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
                  <label>
                    Quantidade de filhos com câncer
                    <input
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        e.target.value = value >= 0 ? value : 0;
                      }}
                    />
                  </label>
                  <label>
                    Quantidade de filhas com câncer
                    <input
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        e.target.value = value >= 0 ? value : 0;
                      }}
                    />
                  </label>
                  {children.map((child, index) => (
                    <div key={index} className="child-container">
                      <label>Filho {index + 1}</label>
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
                          {showAgeDropdown ? (
                            <Select
                              placeholder="Selecione..."
                              options={ageOptions}
                              value={child.age}
                              onChange={(selectedOption) => {
                                const newChildren = [...children];
                                newChildren[index].age = selectedOption;
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
                                newChildren[index].age = value >= 0 ? value : 0; // Validação para não aceitar valores negativos
                                setChildren(newChildren);
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
  onBack: PropTypes.func, // Adiciona a prop onBack opcional
};
