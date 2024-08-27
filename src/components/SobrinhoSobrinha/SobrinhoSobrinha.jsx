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
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    setQuantities((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([...cancerDetails, { type: [], gender: "", age: "" }]);
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

  const handleCancerCheckboxChange = (value) => {
    setHasCancer(value === "alguns");
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
