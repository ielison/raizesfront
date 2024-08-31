import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./SobrinhoSobrinha.css";

export default function SobrinhosSobrinhas({ onClose, onAdvance }) {
  const [quantities, setQuantities] = useState({
    sobrinhos: "",
    meioSobrinhos: "",
  });
  const [hasCancer, setHasCancer] = useState(null);
  const [cancerDetails, setCancerDetails] = useState([
    { type: [], gender: "", age: "" },
  ]);
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]); // Track age dropdowns for each child

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    // Ensure non-negative value for quantities
    const quantityValue = Math.max(0, value);
    setQuantities((prev) => ({ ...prev, [name]: quantityValue }));
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([...cancerDetails, { type: [], gender: "", age: "" }]);
    setShowAgeDropdowns([...showAgeDropdowns, false]); // Add a new entry for the new child
  };

  const handleAgeToggle = (index) => {
    const newShowAgeDropdowns = [...showAgeDropdowns];
    newShowAgeDropdowns[index] = !newShowAgeDropdowns[index]; // Toggle only the clicked child's dropdown
    setShowAgeDropdowns(newShowAgeDropdowns);
  };

  const handleBackClick = () => {
    onClose();
  };

  const handleAdvanceClick = () => {
    onAdvance();
  };

  const handleCancerCheckboxChange = (value) => {
    setHasCancer(value === "alguns");
  };

  const handleAgeChange = (index, value) => {
    // Ensure non-negative value for age
    const ageValue = Math.max(0, value);
    const newDetails = [...cancerDetails];
    newDetails[index].age = ageValue;
    setCancerDetails(newDetails);
  };

  return (
    <div className="sobrinhos-sobrinhas-modal-overlay" onClick={onClose}>
      <div
        className="sobrinhos-sobrinhas-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar activeEtapa="etapa1" />
        <div className="sobrinhos-sobrinhas-form-container">
          <button
            className="sobrinhos-sobrinhas-close-button"
            onClick={onClose}
          >
            &times;
          </button>
          <h2>Etapa 1 - Sobrinhos e Sobrinhas</h2>
          <label>
            Quantos filhos que os irmãos ou meio-irmãos possuem?
            <div className="sobrinhos-sobrinhas-quantity-group">
              <label>
                Sobrinhos
                <input
                  type="number"
                  name="sobrinhos"
                  value={quantities.sobrinhos}
                  onChange={handleQuantityChange}
                  placeholder="Quantidade"
                  min="0" // Ensure the input cannot be less than 0
                />
              </label>
              <label>
                Meio-sobrinhos
                <input
                  type="number"
                  name="meioSobrinhos"
                  value={quantities.meioSobrinhos}
                  onChange={handleQuantityChange}
                  placeholder="Quantidade"
                  min="0" // Ensure the input cannot be less than 0
                />
              </label>
            </div>
          </label>
          <label>
            Algum dos seus sobrinhos já teve câncer?
            <div className="sobrinhos-sobrinhas-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="alguns"
                  checked={hasCancer === true}
                  onChange={() => handleCancerCheckboxChange("alguns")}
                />
                Sim
              </label>
              <label>
                <input
                  type="checkbox"
                  value="nenhum"
                  checked={hasCancer === false}
                  onChange={() => handleCancerCheckboxChange("nenhum")}
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
                  <label>
                    Sexo
                    <select
                      value={detail.gender}
                      onChange={(e) => {
                        const newDetails = [...cancerDetails];
                        newDetails[index].gender = e.target.value;
                        setCancerDetails(newDetails);
                      }}
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </label>
                  <label className="ii-idade">
                    <div className="ii-idade-div">
                      Idade
                      {showAgeDropdowns[index] ? (
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
                          onChange={(e) => handleAgeChange(index, Number(e.target.value))}
                          min="0" // Ensure the input cannot be less than 0
                        />
                      )}
                    </div>
                    <button
                      className="btn-naosei"
                      type="button"
                      onClick={() => handleAgeToggle(index)} // Pass the index to toggle the specific child's dropdown
                    >
                      {showAgeDropdowns[index] ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
                </div>
              ))}
              <button className="ss-btn-add" onClick={handleAddCancerDetail}>
                Informar +
              </button>
            </>
          )}
          <div className="ss-form-buttons">
            <button className="ss-btn-back" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="ss-btn-next" onClick={handleAdvanceClick}>
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SobrinhosSobrinhas.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
