import { useState } from "react";
import PropTypes from "prop-types";
import "./DadosPaciente2.css";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";

export default function DadosPaciente2({ onFormChange }) {
  const [diagnoses, setDiagnoses] = useState([{ type: [], age: "" }]);
  const [hasCancer, setHasCancer] = useState(false);
  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(false);

  // State to hold user data
  const [userData, setUserData] = useState({
    nome: "",
    sexo: "",
    idade: 0,
    teveCancer: false,
    qualCancer: "",
    idadeDiagnostico: 0,
    telefone: "",
    dataConsulta: "",
  });

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleOtherDiagnosisChange = (e) => {
    const newHasOtherDiagnosis = e.target.value === "sim";
    setHasOtherDiagnosis(newHasOtherDiagnosis);
    onFormChange({ outroCancer: newHasOtherDiagnosis });

    // Reset outroCancerList if the user changes the selection
    if (!newHasOtherDiagnosis) {
      setDiagnoses([{ type: [], age: "" }]); // Resetting the diagnoses state
      onFormChange({ outroCancerList: [] }); // Clear the outroCancerList
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);
    console.log("User Data Updated:", updatedUserData);
    
    // Update the form with the complete userData object
    onFormChange({
      usuariPrincipal: {
        ...updatedUserData,
        qualCancer: updatedUserData.qualCancer || "", // Ensuring it's a string
        outroCancer: hasOtherDiagnosis,
        outroCancerList: diagnoses.map(d => ({
          idCancer: 0, // Placeholder
          tipoCancer: d.type.map(opt => opt.label).join(", ") || "", // Ensuring it's a string
          idadeDiagnostico: d.age ? Number(d.age) : 0 // Convert to number or default to 0
        })),
      },
    });
  };

  const handleDiagnosisChange = (index, field, value) => {
    const updatedDiagnoses = [...diagnoses];
    updatedDiagnoses[index][field] = value;
    setDiagnoses(updatedDiagnoses);
    
    // Update outroCancerList when the diagnosis changes
    handleFieldChange('qualCancer', userData.qualCancer); // Re-trigger the form update
  };

  return (
    <div className="dp-form-container">
      <label className="nome-paciente">
        <span>Qual o nome do paciente?</span>
        <input
          type="text"
          placeholder="Informe o nome do paciente"
          onChange={(e) => handleFieldChange("nome", e.target.value)}
        />
      </label>

      {/* Campo de Telefone */}
      <label className="telefone-paciente">
        <span>Telefone</span>
        <input
          type="tel"
          placeholder="Informe o telefone do paciente"
          onChange={(e) => handleFieldChange("telefone", e.target.value)}
        />
      </label>

      <div className="dp-row">
        <label className="sexo-paciente" style={{ flex: 1, marginRight: "10px" }}>
          Sexo biológico
          <select
            defaultValue=""
            onChange={(e) => handleFieldChange("sexo", e.target.value)}
          >
            <option value="" disabled>Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          Idade do Paciente
          <input
            type="number"
            min="0"
            onChange={(e) => handleFieldChange("idade", Math.max(0, e.target.value))}
          />
        </label>
      </div>

      <label>
        O Sr(a) já teve câncer?
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="hasCancer"
              value="sim"
              checked={hasCancer}
              onChange={() => {
                setHasCancer(true);
                handleFieldChange("teveCancer", true);
              }}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasCancer"
              value="nao"
              checked={!hasCancer}
              onChange={() => {
                setHasCancer(false);
                handleFieldChange("teveCancer", false);
              }}
            />
            Não
          </label>
        </div>
      </label>

      {hasCancer && (
        <>
          <div className="dp-row">
            <label style={{ flex: 1, marginRight: "10px" }}>
              Qual tipo de câncer o Sr(a) teve?
              <Select
                isMulti
                options={cancerOptions}
                placeholder="Selecione..."
                onChange={(selectedOptions) => {
                  handleFieldChange("qualCancer", selectedOptions.map(opt => opt.label).join(", "));
                }}
              />
            </label>
            <label style={{ flex: 1 }}>
              Com que idade o Sr(a) recebeu o diagnóstico?
              <input
                type="number"
                min="0"
                onChange={(e) => handleFieldChange("idadeDiagnostico", Math.max(0, e.target.value))}
              />
            </label>
          </div>

          <label>
            O Sr(a) recebeu algum outro diagnóstico de câncer?
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="hasOtherDiagnosis"
                  value="sim"
                  checked={hasOtherDiagnosis}
                  onChange={handleOtherDiagnosisChange}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="hasOtherDiagnosis"
                  value="nao"
                  checked={!hasOtherDiagnosis}
                  onChange={handleOtherDiagnosisChange}
                />
                Não
              </label>
            </div>
          </label>

          {hasOtherDiagnosis && (
            <>
              {diagnoses.map((diagnosis, index) => (
                <div key={index}>
                  <div className="dp-row">
                    <label style={{ flex: 1, marginRight: "10px" }}>
                      Tipo de neoplasia
                      <Select
                        isMulti
                        options={cancerOptions}
                        placeholder="Selecione..."
                        value={diagnosis.type}
                        onChange={(selectedOptions) => handleDiagnosisChange(index, 'type', selectedOptions)}
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      Idade
                      <input
                        type="number"
                        min="0"
                        value={diagnosis.age}
                        onChange={(e) => handleDiagnosisChange(index, 'age', Math.max(0, e.target.value))}
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button className="dp-btn-add" onClick={handleAddDiagnosis}>
                Informar +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

DadosPaciente2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};