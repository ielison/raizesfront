import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DadosPaciente2.css";
import InputMask from "react-input-mask";
import Select from "react-select";
import DeleteIcon from "../../assets/trash.svg"; // Importe o ícone de deletar aqui
import { cancerOptions } from "../../data/cancerOptions";

export default function DadosPaciente2({ onFormChange }) {
  const [diagnoses, setDiagnoses] = useState(() => {
    const storedDiagnoses = JSON.parse(sessionStorage.getItem("diagnoses"));
    return storedDiagnoses || [{ type: [], age: "" }];
  });

  const [hasCancer, setHasCancer] = useState(() => {
    const storedHasCancer = JSON.parse(sessionStorage.getItem("hasCancer"));
    return storedHasCancer !== null ? storedHasCancer : false;
  });

  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(() => {
    const storedHasOtherDiagnosis = JSON.parse(
      sessionStorage.getItem("hasOtherDiagnosis")
    );
    return storedHasOtherDiagnosis !== null ? storedHasOtherDiagnosis : false;
  });

  const [userData, setUserData] = useState(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
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
    sessionStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("diagnoses", JSON.stringify(diagnoses));
    sessionStorage.setItem("hasCancer", JSON.stringify(hasCancer));
    sessionStorage.setItem(
      "hasOtherDiagnosis",
      JSON.stringify(hasOtherDiagnosis)
    );
  }, [userData, diagnoses, hasCancer, hasOtherDiagnosis]);

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleRemoveDiagnosis = (index) => {
    const updatedDiagnoses = diagnoses.filter((_, i) => i !== index);
    setDiagnoses(updatedDiagnoses);
    updateForm();
  };

  const handleOtherDiagnosisChange = (e) => {
    const newHasOtherDiagnosis = e.target.value === "sim";
    setHasOtherDiagnosis(newHasOtherDiagnosis);

    if (!newHasOtherDiagnosis) {
      setDiagnoses([{ type: [], age: "" }]);
    }
    updateForm();
  };

  const handleFieldChange = (field, value) => {
    const processedValue =
      field === "telefone" ? value.replace(/\D/g, "") : value;
    const updatedUserData = { ...userData, [field]: processedValue };
    setUserData(updatedUserData);
    updateForm();
  };

  const handleDiagnosisChange = (index, field, value) => {
    const updatedDiagnoses = [...diagnoses];
    updatedDiagnoses[index][field] = value;
    setDiagnoses(updatedDiagnoses);
    updateForm();
  };

  const updateForm = () => {
    onFormChange({
      usuariPrincipal: {
        quizId: 0,
        teveCancer: hasCancer,
        qualCancer: userData.qualCancer || "",
        idadeDiagnostico: userData.idadeDiagnostico || 0,
        outroCancer: hasOtherDiagnosis,
        sexo: userData.sexo || "string",
        nome: userData.nome || "string",
        idade: userData.idade || 0,
        telefone: userData.telefone || "string",
        dataConsulta: userData.dataConsulta || "string",
        outroCancerList: diagnoses.map((d) => ({
          idCancer: 0,
          tipoCancer: d.type.map((opt) => opt.label).join(", ") || "string",
          idadeDiagnostico: d.age ? Number(d.age) : 0,
        })),
      },
    });
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

      <div className="dp-row">
        <label className="telefone-paciente">
          <span>Telefone</span>
          <InputMask
            style={{ flex: 1 }}
            mask="(99) 99999-9999"
            placeholder="Informe o telefone do paciente"
            value={userData.telefone}
            onChange={(e) => handleFieldChange("telefone", e.target.value)}
          >
            {(inputProps) => <input type="tel" {...inputProps} />}
          </InputMask>
        </label>
      </div>

      <div className="dp-row">
        <label className="sexo-paciente" style={{ flex: 1 }}>
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
                      Idade do diagnóstico
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
                  <button
                    className="ff-btn-delete"
                    type="button"
                    onClick={() => handleRemoveDiagnosis(index)}
                  >
                    <img src={DeleteIcon} alt="Deletar" />
                  </button>
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
