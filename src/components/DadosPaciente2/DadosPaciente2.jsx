import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DadosPaciente2.css";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";

export default function DadosPaciente2({ onFormChange }) {
  const [diagnoses, setDiagnoses] = useState(() => {
    const storedDiagnoses = JSON.parse(localStorage.getItem("diagnoses"));
    return storedDiagnoses || [{ type: [], age: "" }];
  });

  const [hasCancer, setHasCancer] = useState(() => {
    const storedHasCancer = JSON.parse(localStorage.getItem("hasCancer"));
    return storedHasCancer !== null ? storedHasCancer : false;
  });

  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(() => {
    const storedHasOtherDiagnosis = JSON.parse(
      localStorage.getItem("hasOtherDiagnosis")
    );
    return storedHasOtherDiagnosis !== null ? storedHasOtherDiagnosis : false;
  });

  const [userData, setUserData] = useState(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    return (
      storedUserData || {
        nome: "",
        sexo: "",
        idade: 0,
        teveCancer: false,
        qualCancer: "",
        idadeDiagnostico: 0,
        telefone: "",
        dataConsulta: "",
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("diagnoses", JSON.stringify(diagnoses));
    localStorage.setItem("hasCancer", JSON.stringify(hasCancer)); // Salvando hasCancer
    localStorage.setItem(
      "hasOtherDiagnosis",
      JSON.stringify(hasOtherDiagnosis)
    ); // Salvando hasOtherDiagnosis
  }, [userData, diagnoses, hasCancer, hasOtherDiagnosis]);

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleOtherDiagnosisChange = (e) => {
    const newHasOtherDiagnosis = e.target.value === "sim";
    setHasOtherDiagnosis(newHasOtherDiagnosis);
    onFormChange({ outroCancer: newHasOtherDiagnosis });

    if (!newHasOtherDiagnosis) {
      setDiagnoses([{ type: [], age: "" }]);
      onFormChange({ outroCancerList: [] });
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedUserData = {
      ...userData,
      [field]: value,
      outroCancer: hasOtherDiagnosis,
    };
    setUserData(updatedUserData);

    onFormChange({
      usuariPrincipal: {
        ...updatedUserData,
        qualCancer: updatedUserData.qualCancer || "",
        outroCancerList: diagnoses.map((d) => ({
          idCancer: 0,
          tipoCancer: d.type.map((opt) => opt.label).join(", ") || "",
          idadeDiagnostico: d.age ? Number(d.age) : 0,
        })),
      },
    });
  };

  const handleDiagnosisChange = (index, field, value) => {
    const updatedDiagnoses = [...diagnoses];
    updatedDiagnoses[index][field] = value;

    // Update userData with the current diagnoses
    setDiagnoses(updatedDiagnoses);
    handleFieldChange(
      "qualCancer",
      updatedDiagnoses
        .map((d) => d.type.map((opt) => opt.label).join(", "))
        .join(", ")
    );
  };

  return (
    <div className="dp-form-container">
      <label className="nome-paciente">
        <span>Qual o nome do(a) paciente?</span>
        <input
          type="text"
          placeholder="Informe o nome do paciente"
          value={userData.nome}
          onChange={(e) => handleFieldChange("nome", e.target.value)}
        />
      </label>

      {/* Campo de Telefone */}
      <label className="telefone-paciente">
        <span>Telefone</span>
        <input
          type="tel"
          placeholder="Informe o telefone do paciente"
          value={userData.telefone}
          onChange={(e) => handleFieldChange("telefone", e.target.value)}
        />
      </label>

      <div className="dp-row">
        <label
          className="sexo-paciente"
          style={{ flex: 1, marginRight: "10px" }}
        >
          Sexo biológico
          <select
            value={userData.sexo}
            onChange={(e) => handleFieldChange("sexo", e.target.value)}
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          Idade do(a) Paciente
          <input
            type="number"
            min="0"
            value={userData.idade}
            onChange={(e) =>
              handleFieldChange("idade", Math.max(0, e.target.value))
            }
          />
        </label>
      </div>

      <label>
        O(A) Sr(a) já teve câncer?
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
              Qual tipo de câncer o(a) Sr(a) teve?
              <Select
                isMulti
                options={cancerOptions}
                placeholder="Selecione..."
                onChange={(selectedOptions) => {
                  handleFieldChange(
                    "qualCancer",
                    selectedOptions.map((opt) => opt.label).join(", ")
                  );
                }}
              />
            </label>
            <label style={{ flex: 1 }}>
              Com que idade recebeu o diagnóstico?
              <input
                type="number"
                min="0"
                value={userData.idadeDiagnostico}
                onChange={(e) =>
                  handleFieldChange(
                    "idadeDiagnostico",
                    Math.max(0, e.target.value)
                  )
                }
              />
            </label>
          </div>

          <label>
            O(A) Sr(a) recebeu algum outro diagnóstico de câncer?
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
                        onChange={(selectedOptions) =>
                          handleDiagnosisChange(index, "type", selectedOptions)
                        }
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      Idade
                      <input
                        type="number"
                        min="0"
                        value={diagnosis.age}
                        onChange={(e) =>
                          handleDiagnosisChange(
                            index,
                            "age",
                            Math.max(0, e.target.value)
                          )
                        }
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
