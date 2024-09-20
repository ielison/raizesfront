import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./IrmaosIrmas2.css";

export default function IrmaosIrmas2({ onFormChange }) {
  const [relationships, setRelationships] = useState([]);
  const [hasCancer, setHasCancer] = useState(false);
  const [siblings, setSiblings] = useState([]);

  const relationshipLabels = {
    irmaos: "Irmãos",
    irma: "Irmãs",
    meioIrmaosPaterno: "Meio-irmãos (paterno)",
    meioIrmasPaterno: "Meio-irmãs (paterno)",
    meioIrmaosMaterno: "Meio-irmãos (materno)",
    meioIrmasMaterno: "Meio-irmãs (materno)",
    naoPossuoIrmaos: "Não possuo irmãos",
  };

  useEffect(() => {
    const irmaosList = siblings.map((sibling) => ({
      id: sibling.id || 0,
      temIrmao: true,
      qtdIrmao: siblings.length,
      teveCancer: hasCancer,
      qtdeIrmaosCancer: sibling.type.length > 0 ? 1 : 0,
      sexo: sibling.sex,
      outroCancerList: sibling.type.map((tipo) => ({
        id: 0,
        idadeDiagnostico: sibling.age ? sibling.age.value || sibling.age : 0,
        tipoCancer: tipo.label,
      })),
    }));

    // Pass formatted data to onFormChange
    onFormChange({ irmaosList });
  }, [siblings, hasCancer, onFormChange]);

  const handleRelationshipChange = (e) => {
    const { value } = e.target;

    if (value === "naoPossuoIrmaos") {
      setRelationships(["naoPossuoIrmaos"]);
    } else {
      setRelationships((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev.filter((item) => item !== "naoPossuoIrmaos"), value]
      );
    }
  };

  const handleAddSibling = () => {
    setSiblings([...siblings, { id: siblings.length, sex: "", type: [], age: "", showAgeDropdown: false }]);
  };

  const toggleAgeDropdown = (index) => {
    const newSiblings = [...siblings];
    newSiblings[index].showAgeDropdown = !newSiblings[index].showAgeDropdown;
    setSiblings(newSiblings);
  };

  const handleQuantityChange = (index, value) => {
    const newSiblings = [...siblings];
    newSiblings[index].quantity = value; // Ensure to store the quantity in the sibling object
    setSiblings(newSiblings);
  };

  return (
    <div className="ii-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="ii-form-container">
        <label className="ii-possui-irmao">
          <span>O Sr(a) possui irmãos, meio-irmãos ou meio-irmãs?</span>
          <div className="ii-radio-group-first">
            {Object.entries(relationshipLabels).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name="relationship"
                  value={key}
                  checked={relationships.includes(key)}
                  onChange={handleRelationshipChange}
                />
                {label}
              </label>
            ))}
          </div>
        </label>
        {relationships.length > 0 && !relationships.includes("naoPossuoIrmaos") && (
          <>
            {relationships.map((relation, index) => (
              <label key={index}>
                {relationshipLabels[relation]}
                <input
                  type="number"
                  placeholder="Quantidade"
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))} 
                  min="0"
                />
              </label>
            ))}
            <label>
              Algum deles foi acometido por algum câncer?
              <div className="ii-radio-group">
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
                {siblings.map((sibling, index) => (
                  <div key={index}>
                    <label>
                      Sexo
                      <Select
                        options={[
                          { value: "masculino", label: "Masculino" },
                          { value: "feminino", label: "Feminino" },
                        ]}
                        onChange={(selectedOption) => {
                          const newSiblings = [...siblings];
                          newSiblings[index].sex = selectedOption.value;
                          setSiblings(newSiblings);
                        }}
                        placeholder="Selecione o sexo"
                      />
                    </label>
                    <label>
                      Tipo de câncer
                      <Select
                        isMulti
                        options={cancerOptions}
                        value={sibling.type}
                        onChange={(selectedOptions) => {
                          const newSiblings = [...siblings];
                          newSiblings[index].type = selectedOptions;
                          setSiblings(newSiblings);
                        }}
                      />
                    </label>
                    <label className="ii-idade">
                      <div className="ii-idade-div">
                        Idade
                        {sibling.showAgeDropdown ? (
                          <Select
                            options={ageOptions}
                            value={sibling.age}
                            onChange={(selectedOption) => {
                              const newSiblings = [...siblings];
                              newSiblings[index].age = selectedOption;
                              setSiblings(newSiblings);
                            }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={sibling.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newSiblings = [...siblings];
                              newSiblings[index].age = value >= 0 ? value : 0;
                              setSiblings(newSiblings);
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAgeDropdown(index)}
                      >
                        {sibling.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                    </label>
                  </div>
                ))}
                <button className="ii-btn-add" onClick={handleAddSibling}>
                  Informar +
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

IrmaosIrmas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
