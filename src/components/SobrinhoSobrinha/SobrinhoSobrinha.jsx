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
  const [hasCancer, setHasCancer] = useState(null); // null to handle both "Sim" and "Não"
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
    console.log("Back button clicked");
    onClose();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  const handleCancerCheckboxChange = (value) => {
    setHasCancer(value === "alguns");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-sobrinhos__sobrinhas" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa1" />
        <div className="form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Etapa 1 - Sobrinhos e Sobrinhas</h2>
          <label>
            Quantos filhos que os irmãos ou meio-irmãos possuem?
            <div className="quantity-group">
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
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="alguns"
                  checked={hasCancer === true}
                  onChange={() => handleCancerCheckboxChange("alguns")}
                />
                Algum sobrinho ou meio sobrinho já foi acometido
              </label>
              <label>
                <input
                  type="checkbox"
                  value="nenhum"
                  checked={hasCancer === false}
                  onChange={() => handleCancerCheckboxChange("nenhum")}
                />
                Nenhum sobrinho ou meio-sobrinho já foi acometido
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
              <button className="btn-add" onClick={handleAddCancerDetail}>
                Informar +
              </button>
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

SobrinhosSobrinhas.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
