import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./FamiliaresDistantesPaterno.css";

export default function FamiliaresDistantesPaterno({
  onClose,
  onBack,
  onAdvance,
}) {
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [distantesHadCancer, setDistantesHadCancer] = useState(false);
  const [distantesDetails, setDistantesDetails] = useState([
    { relationship: "", gender: "", type: null, age: "" },
  ]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge(!noKnowledge);
  };

  const handleAgeToggle = () => {
    setShowAgeDropdown(!showAgeDropdown);
  };

  const handleAddMore = () => {
    setDistantesDetails([
      ...distantesDetails,
      { relationship: "", gender: "", type: null, age: "" },
    ]);
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    onBack();
  };

  const handleAdvanceClick = () => {
    console.log("Advance button clicked");
    onAdvance();
  };

  return (
    <div className="fdp-modal-overlay" onClick={onClose}>
      <div className="fdp-modal-content" onClick={(e) => e.stopPropagation()}>
        <Sidebar activeEtapa="etapa3" />
        <button className="fdp-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="fdp-form-container">
          <h2 className="fdp-title">Etapa 3 - Familiares Distantes</h2>

          <label>
            Algum outro familiar do seu lado paterno já teve câncer?
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={distantesHadCancer}
                  onChange={() => setDistantesHadCancer(!distantesHadCancer)}
                />
                Sim
              </label>
              <label>
                <input
                  type="checkbox"
                  value="none"
                  checked={!distantesHadCancer}
                  onChange={() => setDistantesHadCancer(false)}
                />
                Não
              </label>
              <label>
                <input
                  type="checkbox"
                  value="no-knowledge"
                  checked={noKnowledge}
                  onChange={handleNoKnowledgeChange}
                />
                Não tenho conhecimento da saúde dos meus parentes distantes
                paternos
              </label>
            </div>
          </label>

          {!noKnowledge && distantesHadCancer && (
            <>
              {distantesDetails.map((distante, index) => (
                <div key={index}>
                  <label>
                    Parentesco:
                    <input
                      type="text"
                      value={distante.relationship}
                      onChange={(e) => {
                        const newDetails = [...distantesDetails];
                        newDetails[index].relationship = e.target.value;
                        setDistantesDetails(newDetails);
                      }}
                    />
                  </label>
                  <label>
                    Sexo:
                    <Select
                      options={[
                        { value: "feminino", label: "Feminino" },
                        { value: "masculino", label: "Masculino" },
                      ]}
                      value={distante.gender}
                      onChange={(selectedOption) => {
                        const newDetails = [...distantesDetails];
                        newDetails[index].gender = selectedOption;
                        setDistantesDetails(newDetails);
                      }}
                    />
                  </label>
                  <label>
                    Tipo de câncer:
                    <Select
                      options={cancerOptions}
                      value={distante.type}
                      onChange={(selectedOption) => {
                        const newDetails = [...distantesDetails];
                        newDetails[index].type = selectedOption;
                        setDistantesDetails(newDetails);
                      }}
                    />
                  </label>
                  <label>
                    Idade:
                    {showAgeDropdown ? (
                      <Select
                        options={ageOptions}
                        value={distante.age}
                        onChange={(selectedOption) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].age = selectedOption;
                          setDistantesDetails(newDetails);
                        }}
                      />
                    ) : (
                      <input
                        type="number"
                        value={distante.age}
                        onChange={(e) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].age = e.target.value;
                          setDistantesDetails(newDetails);
                        }}
                      />
                    )}
                    <button type="button" onClick={handleAgeToggle}>
                      {showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
                </div>
              ))}
              <button type="button" className="btn-add" onClick={handleAddMore}>
                +
              </button>
            </>
          )}

          <div className="fdp-form-buttons">
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

FamiliaresDistantesPaterno.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};
