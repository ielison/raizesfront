import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions"; // Importe ageOptions
import Sidebar from "../Sidebar/Sidebar";
import "./FilhosFilhas.css";

export default function FilhosFilhas({ onClose, onAdvance }) {
  const [hasChildren, setHasChildren] = useState(null); // Alterado para null
  const [hasCancer, setHasCancer] = useState(false);
  const [children, setChildren] = useState([{ type: "", age: "" }]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleAddChild = () => {
    setChildren([...children, { type: "", age: "" }]);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleBackClick = () => {
    onClose();
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-filhos__filhas"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar activeEtapa="etapa1" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 1 - Filhos e Filhas</h2>
          <label>
            O Sr(a) tem filhos e filhas?
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="hasChildren"
                  value="sim"
                  checked={hasChildren === true}
                  onChange={() => setHasChildren(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="checkbox"
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
              <label>
                Quantidade de filhos
                <input type="number" />
              </label>
              <label>
                Quantidade de filhas
                <input type="number" />
              </label>
              <label>
                Algum deles já teve câncer?
                <input
                  type="checkbox"
                  checked={hasCancer}
                  onChange={() => setHasCancer(!hasCancer)}
                />
              </label>
              {hasCancer && (
                <>
                  <label>
                    Quantidade de filhos com câncer
                    <input type="number" />
                  </label>
                  <label>
                    Quantidade de filhas com câncer
                    <input type="number" />
                  </label>
                  {children.map((child, index) => (
                    <div key={index}>
                      <label>Filho {index + 1}</label>
                      <label>
                        Tipo
                        <Select
                          options={cancerOptions}
                          value={child.type}
                          onChange={(selectedOption) => {
                            const newChildren = [...children];
                            newChildren[index].type = selectedOption;
                            setChildren(newChildren);
                          }}
                        />
                      </label>
                      <label>
                        Idade
                        {showAgeDropdown ? (
                          <Select
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
                              const newChildren = [...children];
                              newChildren[index].age = e.target.value;
                              setChildren(newChildren);
                            }}
                          />
                        )}
                        <button type="button" onClick={handleAgeToggle}>
                          {showAgeDropdown ? "Digitar idade" : "Não sei"}
                        </button>
                      </label>
                    </div>
                  ))}
                  <button onClick={handleAddChild}>Informar +</button>
                </>
              )}
            </>
          )}
          <div className="ff-form-buttons">
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

FilhosFilhas.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
