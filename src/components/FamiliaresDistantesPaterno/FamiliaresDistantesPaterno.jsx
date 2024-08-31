import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import Sidebar from "../Sidebar/Sidebar";
import "./FamiliaresDistantesPaterno.css"; // Update the CSS file name

const relationshipOptions = [
  { value: "mãe", label: "Mãe" },
  { value: "pai", label: "Pai" },
  { value: "filho", label: "Filho" },
  { value: "filha", label: "Filha" },
  { value: "irmão", label: "Irmão" },
  { value: "irmã", label: "Irmã" },
  { value: "meio-irmão paterno", label: "Meio-Irmão Paterno" },
  { value: "meia-irmã paterna", label: "Meia-Irmã Paterna" },
  { value: "sobrinho", label: "Sobrinho" },
  { value: "sobrinha", label: "Sobrinha" },
  { value: "tio paterno", label: "Tio Paterno" },
  { value: "tia paterna", label: "Tia Paterna" },
  { value: "avô paterno", label: "Avô Paterno" },
  { value: "avó paterna", label: "Avó Paterna" },
  { value: "neto", label: "Neto" },
  { value: "neta", label: "Neta" },
  { value: "bisavô paterno", label: "Bisavô Paterno" },
  { value: "bisavó paterna", label: "Bisavó Paterna" },
  { value: "bisneto", label: "Bisneto" },
  { value: "bisneta", label: "Bisneta" },
  { value: "outro", label: "Outro" },
];

export default function FamiliaresDistantesPaterno({
  onClose,
  onBack,
  onAdvance,
}) {
  const [distantesHadCancer, setDistantesHadCancer] = useState(null);
  const [distantesDetails, setDistantesDetails] = useState([
    { relationship: "", type: null, age: "", showAgeDropdown: false },
  ]);

  const handleDistantesHadCancerChange = (value) => {
    setDistantesHadCancer(value);

    // Clear selections if "Sim" or "Não" is selected
    if (value === false) {
      setDistantesDetails([
        { relationship: "", type: null, age: "", showAgeDropdown: false },
      ]);
    }
  };

  const handleAgeToggle = (index) => {
    const newDetails = [...distantesDetails];
    newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
    setDistantesDetails(newDetails);
  };

  const handleAddMore = () => {
    setDistantesDetails([
      ...distantesDetails,
      { relationship: "", type: null, age: "", showAgeDropdown: false },
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
        <Sidebar activeEtapa="etapa2" />
        <button className="fdp-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="fdp-form-container">
          <h2 className="fdp-title">Etapa 2 - Familiares Distantes</h2>

          <label>
            Algum outro familiar do seu lado paterno já teve câncer?
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === true}
                  onChange={() => handleDistantesHadCancerChange(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === false}
                  onChange={() => handleDistantesHadCancerChange(false)}
                />
                Não
              </label>
              <label>
                <input
                  type="radio"
                  name="distantesHadCancer"
                  checked={distantesHadCancer === null}
                  onChange={() => handleDistantesHadCancerChange(null)}
                />
                Não tenho conhecimento da saúde dos meus parentes distantes
                paternos
              </label>
            </div>
          </label>

          {distantesHadCancer && (
            <>
              {distantesDetails.map((distante, index) => (
                <div key={index}>
                  <label>
                    Parentesco:
                    <Select
                      options={relationshipOptions}
                      value={relationshipOptions.find(
                        (option) => option.value === distante.relationship
                      )}
                      onChange={(selectedOption) => {
                        const newDetails = [...distantesDetails];
                        newDetails[index].relationship = selectedOption.value;
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
                    {distante.showAgeDropdown ? (
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
                        type="text"
                        placeholder="Digite a idade"
                        value={distante.age}
                        onChange={(e) => {
                          const newDetails = [...distantesDetails];
                          newDetails[index].age = e.target.value;
                          setDistantesDetails(newDetails);
                        }}
                      />
                    )}
                    <button onClick={() => handleAgeToggle(index)}>
                      {distante.showAgeDropdown
                        ? "Digitar idade"
                        : "Selecionar idade"}
                    </button>
                  </label>
                </div>
              ))}
              <button onClick={handleAddMore}>Adicionar outro familiar</button>
            </>
          )}

          <div className="fdp-button-container">
            <button className="fdp-back-button" onClick={handleBackClick}>
              Voltar
            </button>
            <button className="fdp-advance-button" onClick={handleAdvanceClick}>
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
