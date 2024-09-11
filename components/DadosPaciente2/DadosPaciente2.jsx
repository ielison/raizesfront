import { useState } from "react";
import "./DadosPaciente2.css"; // Keep your CSS as is
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";

export default function DadosPaciente2() {
  const [diagnoses, setDiagnoses] = useState([{ type: [], age: "" }]);
  const [hasCancer, setHasCancer] = useState(false);
  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(false);

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleOtherDiagnosisChange = (e) => {
    setHasOtherDiagnosis(e.target.value === "sim");
  };

  return (
    <div className="dp-form-container">
      <label className="nome-paciente">
        <span>Qual o nome do paciente?</span>
        <input type="text" placeholder="Informe o nome do paciente" />
      </label>

      <div className="dp-row">
        <label
          className="sexo-paciente"
          style={{ flex: 1, marginRight: "10px" }}
        >
          Sexo biológico
          <select defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          Idade do Paciente
          <input
            type="number"
            onChange={(e) => (e.target.value = Math.max(0, e.target.value))}
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
              onChange={() => setHasCancer(true)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasCancer"
              value="nao"
              checked={!hasCancer}
              onChange={() => setHasCancer(false)}
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
              />
            </label>
            <label style={{ flex: 1 }}>
              Com que idade o Sr(a) recebeu o diagnóstico?
              <input
                type="number"
                onChange={(e) => (e.target.value = Math.max(0, e.target.value))}
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
              {diagnoses.map((_, index) => (
                <div key={index}>
                  <div className="dp-row">
                    <label style={{ flex: 1, marginRight: "10px" }}>
                      Tipo de neoplasia
                      <Select
                        isMulti
                        options={cancerOptions}
                        placeholder="Selecione..."
                        value={diagnoses[index].type}
                        onChange={(selectedOptions) => {
                          const newDiagnoses = [...diagnoses];
                          newDiagnoses[index].type = selectedOptions;
                          setDiagnoses(newDiagnoses);
                        }}
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      Idade
                      <input
                        type="number"
                        value={diagnoses[index].age}
                        onChange={(e) => {
                          const value = Math.max(0, e.target.value);
                          const newDiagnoses = [...diagnoses];
                          newDiagnoses[index].age = value;
                          setDiagnoses(newDiagnoses);
                        }}
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

// Remove the PropTypes declaration for onAdvance
