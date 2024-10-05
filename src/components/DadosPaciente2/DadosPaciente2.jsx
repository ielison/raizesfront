import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DadosPaciente2.css";
import InputMask from "react-input-mask";
import Select from "react-select";
import DeleteIcon from "../../assets/trash.svg";
import { cancerOptions } from "../../data/cancerOptions";

export default function DadosPaciente2({ onFormChange, initialData }) {
  const [diagnoses, setDiagnoses] = useState(() => {
    const storedDiagnoses = localStorage.getItem("dp2_diagnoses");
    return storedDiagnoses
      ? JSON.parse(storedDiagnoses)
      : [{ type: [], age: "" }];
  });

  const [hasCancer, setHasCancer] = useState(() => {
    const storedHasCancer = localStorage.getItem("dp2_hasCancer");
    return storedHasCancer ? JSON.parse(storedHasCancer) : false;
  });

  const [hasOtherDiagnosis, setHasOtherDiagnosis] = useState(() => {
    const storedHasOtherDiagnosis = localStorage.getItem(
      "dp2_hasOtherDiagnosis"
    );
    return storedHasOtherDiagnosis
      ? JSON.parse(storedHasOtherDiagnosis)
      : false;
  });

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("dp2_userData");
    return storedUserData
      ? JSON.parse(storedUserData)
      : {
          nome: "",
          sexo: "",
          idade: "",
          teveCancer: false,
          qualCancer: [],
          idadeDiagnostico: "",
          telefone: "",
          dataConsulta: "",
        };
  });

  useEffect(() => {
    if (initialData) {
      setUserData((prevData) => ({
        ...prevData,
        ...initialData.usuariPrincipal,
        idade: initialData.usuariPrincipal?.idade
          ? initialData.usuariPrincipal.idade.toString()
          : "",
        idadeDiagnostico: initialData.usuariPrincipal?.idadeDiagnostico
          ? initialData.usuariPrincipal.idadeDiagnostico.toString()
          : "",
        qualCancer: initialData.usuariPrincipal?.qualCancer
          ? initialData.usuariPrincipal.qualCancer
              .split(", ")
              .map((cancer) => ({ value: cancer, label: cancer }))
          : [],
      }));
      setHasCancer(initialData.usuariPrincipal?.teveCancer || false);
      setHasOtherDiagnosis(initialData.usuariPrincipal?.outroCancer || false);
      if (initialData.usuariPrincipal?.outroCancerList) {
        setDiagnoses(
          initialData.usuariPrincipal.outroCancerList.map((cancer) => ({
            type: cancer.tipoCancer
              .split(", ")
              .map((type) => ({ value: type, label: type })),
            age: cancer.idadeDiagnostico.toString(),
          }))
        );
      }
    }
  }, [initialData]);
  useEffect(() => {
    localStorage.setItem("dp2_userData", JSON.stringify(userData));
    localStorage.setItem("dp2_diagnoses", JSON.stringify(diagnoses));
    localStorage.setItem("dp2_hasCancer", JSON.stringify(hasCancer));
    localStorage.setItem(
      "dp2_hasOtherDiagnosis",
      JSON.stringify(hasOtherDiagnosis)
    );

    onFormChange({
      usuariPrincipal: {
        ...userData,
        qualCancer: userData.qualCancer
          .map((cancer) => cancer.label)
          .join(", "),
        outroCancer: hasOtherDiagnosis,
        outroCancerList: diagnoses.map((d) => ({
          idCancer: 0,
          tipoCancer: d.type.map((opt) => opt.label).join(", "),
          idadeDiagnostico: d.age ? Number(d.age) : 0,
        })),
      },
    });
  }, [userData, diagnoses, hasCancer, hasOtherDiagnosis, onFormChange]);

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, { type: [], age: "" }]);
  };

  const handleRemoveDiagnosis = (index) => {
    const updatedDiagnoses = diagnoses.filter((_, i) => i !== index);
    setDiagnoses(updatedDiagnoses);
  };

  const handleOtherDiagnosisChange = (e) => {
    const newHasOtherDiagnosis = e.target.value === "sim";
    setHasOtherDiagnosis(newHasOtherDiagnosis);

    if (!newHasOtherDiagnosis) {
      setDiagnoses([{ type: [], age: "" }]);
    }
  };

  const handleFieldChange = (field, value) => {
    let processedValue = value;
    if (field === "telefone") {
      processedValue = value.replace(/\D/g, "");
    } else if (field === "idade" || field === "idadeDiagnostico") {
      processedValue =
        value === "" ? "" : Math.max(0, parseInt(value, 10)).toString();
    }
    setUserData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleDiagnosisChange = (index, field, value) => {
    const updatedDiagnoses = [...diagnoses];
    if (field === "age") {
      updatedDiagnoses[index][field] =
        value === "" ? "" : Math.max(0, parseInt(value, 10));
    } else {
      updatedDiagnoses[index][field] = value;
    }
    setDiagnoses(updatedDiagnoses);
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
            value={userData.idade === "0" ? "" : userData.idade}
            onChange={(e) => handleFieldChange("idade", e.target.value)}
          />
        </label>
      </div>

      <label>
        O(A) Sr(a) já teve algum tipo câncer ou neoplasia?
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
              Qual tipo de câncer ou neoplasia o(a) Sr(a) teve?
              <Select
                isMulti
                options={cancerOptions}
                placeholder="Selecione..."
                value={userData.qualCancer}
                onChange={(selectedOptions) => {
                  setUserData((prev) => ({
                    ...prev,
                    qualCancer: selectedOptions,
                  }));
                }}
              />
            </label>
            <label style={{ flex: 1 }}>
              Com que idade recebeu o diagnóstico?
              <input
                type="number"
                min="0"
                value={
                  userData.idadeDiagnostico === "0"
                    ? ""
                    : userData.idadeDiagnostico
                }
                onChange={(e) =>
                  handleFieldChange("idadeDiagnostico", e.target.value)
                }
              />
            </label>
          </div>

          <label>
            O(A) Sr(a) recebeu algum outro diagnóstico de câncer ou neoplasia?
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
                      Tipo de câncer ou neoplasia
                      <Select
                        isMulti
                        options={cancerOptions}
                        placeholder="Selecione..."
                        value={diagnosis.type}
                        onChange={(selectedOptions) => {
                          handleDiagnosisChange(index, "type", selectedOptions);
                        }}
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      Idade do diagnóstico
                      <input
                        type="number"
                        min="0"
                        value={diagnosis.age}
                        onChange={(e) =>
                          handleDiagnosisChange(index, "age", e.target.value)
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
  initialData: PropTypes.object,
};
