import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./SobrinhoSobrinha2.css";

export default function SobrinhosSobrinhas2({ onFormChange }) {
  const [quantities, setQuantities] = useState({
    sobrinhos: "",
    meioSobrinhos: "",
  });
  const [hasCancer, setHasCancer] = useState(null);
  const [cancerDetails, setCancerDetails] = useState([
    { type: [], relation: "", age: "" },
  ]);
  const [showAgeDropdowns, setShowAgeDropdowns] = useState([false]); // Track age dropdowns for each child

  useEffect(() => {
    const sobrinhosList = cancerDetails.map((detail, index) => ({
      id: index,
      temSobrinhos: quantities.sobrinhos > 0 || quantities.meioSobrinhos > 0,
      qtdSobrinhos: Number(quantities.sobrinhos),
      qtdSobrinhosCancer: detail.type.length > 0 ? 1 : 0,
      teveCancer: hasCancer,
      meioSobrinho: detail.relation.includes("meio"),
      sexo: detail.relation.includes("sobrinho") ? "masculino" : "feminino",
      outroCancerList: detail.type.map((tipo) => ({
        id: 0,
        idadeDiagnostico: detail.age ? detail.age.value || detail.age : 0,
        tipoCancer: tipo.label,
      })),
    }));

    // Envia os dados formatados para o PacienteModal
    onFormChange({ sobrinhosList });
  }, [quantities, hasCancer, cancerDetails, onFormChange]);

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    const quantityValue = Math.max(0, value); // Ensure non-negative value for quantities
    setQuantities((prev) => ({ ...prev, [name]: quantityValue }));
  };

  const handleAddCancerDetail = () => {
    setCancerDetails([...cancerDetails, { type: [], relation: "", age: "" }]);
    setShowAgeDropdowns([...showAgeDropdowns, false]); // Add a new entry for the new child
  };

  const handleAgeToggle = (index) => {
    const newShowAgeDropdowns = [...showAgeDropdowns];
    newShowAgeDropdowns[index] = !newShowAgeDropdowns[index]; // Toggle only the clicked child's dropdown
    setShowAgeDropdowns(newShowAgeDropdowns);
  };

  const handleCancerCheckboxChange = (value) => {
    setHasCancer(value === "alguns");
  };

  const handleAgeChange = (index, value) => {
    const ageValue = Math.max(0, value); // Ensure non-negative value for age
    const newDetails = [...cancerDetails];
    newDetails[index].age = ageValue;
    setCancerDetails(newDetails);
  };

  return (
    <div className="sobrinhos-sobrinhas-form-container">
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
                Parentesco
                <select
                  value={detail.relation}
                  onChange={(e) => {
                    const newDetails = [...cancerDetails];
                    newDetails[index].relation = e.target.value;
                    setCancerDetails(newDetails);
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="sobrinho">Sobrinho</option>
                  <option value="sobrinha">Sobrinha</option>
                  <option value="meio-sobrinho">Meio-sobrinho</option>
                  <option value="meio-sobrinha">Meio-sobrinha</option>
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
                      onChange={(e) =>
                        handleAgeChange(index, Number(e.target.value))
                      }
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
    </div>
  );
}

SobrinhosSobrinhas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
