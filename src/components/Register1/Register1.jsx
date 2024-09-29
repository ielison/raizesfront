import { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Register2 from "../Register2/Register2";
import countryOptions from "../../data/countryOptions";
import "./Register1.css";
import EyeOpenIcon from "../../assets/open-eye.svg";
import EyeClosedIcon from "../../assets/closed-eye.svg";

export default function Register1({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    pais: "",
    cep: "",
    numeroRua: "",
    cidade: "",
    estado: "",
    rua: "",
    telefone: "",
    celular: "",
    profissionalDaSaude: "",
    graduacao: "",
    titulo: [],
    instituicao: "",
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [isRegister2Open, setRegister2Open] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const tituloOptions = [
    { value: "Especialização", label: "Especialização" },
    { value: "MBA", label: "MBA" },
    { value: "Mestrado acadêmico", label: "Mestrado acadêmico" },
    { value: "Mestrado profissional", label: "Mestrado profissional" },
    { value: "Doutorado", label: "Doutorado" },
    { value: "Pós-doc", label: "Pós-doc" },
  ];

  if (!isOpen) return null;

  const handleFieldFocus = (name) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    if (name === "confirmarSenha") {
      setConfirmPasswordFocus(true);
    }
  };

  const handleFieldBlur = (name) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    if (name === "confirmarSenha") {
      setConfirmPasswordFocus(false);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData({
      ...formData,
      titulo: values, // Atualizando o campo com as opções selecionadas
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Verifica se o campo "Confirmar Senha" é alterado e se as senhas coincidem
    if (name === "confirmarSenha") {
      setTouchedFields((prev) => ({ ...prev, confirmarSenha: true }));
      //console.log("Senha:", formData.senha, "Confirmar Senha:", value); // Debugging
    }
  };

  const handleCEPBlur = () => {
    if (formData.cep) {
      fetch(`https://viacep.com.br/ws/${formData.cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prevState) => ({
            ...prevState,
            cidade: data.localidade || "",
            estado: data.uf || "",
            rua: data.logradouro || "",
          }));
        })
        .catch((err) => console.error("Error fetching CEP data:", err));
    }
  };

  const handleAdvance = (e) => {
    e.preventDefault();

    const requiredFields = [
      "nome",
      "sobrenome",
      "email",
      "senha",
      "confirmarSenha",
    ];

    const allFieldsFilled = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );

    const passwordsMatch = formData.senha === formData.confirmarSenha;

    if (!allFieldsFilled) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!passwordsMatch) {
      alert("As senhas não correspondem. Tente novamente.");
      return;
    }

    setRegister2Open(true);
  };

  const handleBack = () => {
    setRegister2Open(false);
  };

  const handleFinish = () => {
    //console.log("Finalizing registration with data:", formData);
    // Add your finish logic here, like sending data to an API
  };

  const handleProfessionalChange = (value) => {
    setFormData({
      ...formData,
      profissionalDaSaude: value,
    });
    // Mostrar o info-box se "Não sou um profissional da saúde" for selecionado
    if (value === false) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      pais: selectedOption.value, // Atualizando o campo de país
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <>
      {!isRegister2Open && (
        <div className="register1-overlay">
          <div className="register1-modal" onClick={(e) => e.stopPropagation()}>
            <div className="register1-header">
              <h2>Registrar</h2>
              <button className="register1-close-button" onClick={onClose}>
                X
              </button>
            </div>
            <p>Informe seus dados para criar uma conta.</p>
            <p className="fonte-p">
              Os campos com asterisco * ao lado são obrigatórios.
            </p>
            <div className="stepper-wrapper">
              <div
                className={`stepper-item ${
                  isRegister2Open ? "completed" : "active"
                }`}
              >
                <div className="step-counter">1</div>
                <div className="step-name">Informações Básicas</div>
              </div>
              <div
                className={`stepper-item ${isRegister2Open ? "active" : ""}`}
              >
                <div className="step-counter">2</div>
                <div className="step-name">Segunda Etapa</div>
              </div>
            </div>

            <form onSubmit={handleAdvance}>
              <label>Nome *</label>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                onFocus={() => handleFieldFocus("nome")}
                onBlur={() => handleFieldBlur("nome")}
                className={`register1-form-input ${
                  touchedFields.nome && !formData.nome ? "error" : ""
                }`}
              />
              {touchedFields.nome && !formData.nome && (
                <span className="error-message">Campo obrigatório</span>
              )}

              <label>Sobrenome *</label>
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                onFocus={() => handleFieldFocus("sobrenome")}
                onBlur={() => handleFieldBlur("sobrenome")}
                className={`register1-form-input ${
                  touchedFields.sobrenome && !formData.sobrenome ? "error" : ""
                }`}
              />
              {touchedFields.sobrenome && !formData.sobrenome && (
                <span className="error-message">Campo obrigatório</span>
              )}

              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFieldFocus("email")}
                onBlur={() => handleFieldBlur("email")}
                className={`register1-form-input ${
                  touchedFields.email && !formData.email ? "error" : ""
                }`}
              />
              {touchedFields.email && !formData.email && (
                <span className="error-message">Campo obrigatório</span>
              )}

              <label>Senha *</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus("senha")}
                  onBlur={() => handleFieldBlur("senha")}
                  className={`register1-form-input ${
                    touchedFields.senha && !formData.senha ? "error" : ""
                  } ${
                    formData.senha &&
                    formData.senha === formData.confirmarSenha &&
                    touchedFields.confirmarSenha
                      ? "border-green"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="toggle-password-visibility"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? EyeClosedIcon : EyeOpenIcon}
                    alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  />
                </button>
              </div>
              {touchedFields.senha && !formData.senha && (
                <span className="error-message">Campo obrigatório</span>
              )}

              <label>Confirmar Senha *</label>
              <div className="password-input-group">
              <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmarSenha"
                  placeholder="Confirmar Senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus("confirmarSenha")}
                  onBlur={() => handleFieldBlur("confirmarSenha")}
                  className={`register1-form-input 
                    ${touchedFields.confirmarSenha && !formData.confirmarSenha ? "error" : ""} 
                    ${confirmPasswordFocus ? "border-red" : ""}
                    ${formData.confirmarSenha === formData.senha && touchedFields.confirmarSenha ? "border-green" : ""}
                  `}
                />
                <button
                  type="button"
                  className="toggle-password-visibility"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <img
                    src={showConfirmPassword ? EyeClosedIcon : EyeOpenIcon}
                    alt={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  />
                </button>
              </div>
              {touchedFields.confirmarSenha && !formData.confirmarSenha && (
                <span className="error-message">Campo obrigatório</span>
              )}
              <label>País</label>
              <Select
                name="pais"
                options={countryOptions} // Usando a lista importada
                value={countryOptions.find(
                  (option) => option.value === formData.pais
                )}
                onChange={handleCountryChange}
                className="register1-form-input"
                placeholder="Selecione seu país"
              />
              <label>CEP</label>
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCEPBlur}
                className="register1-form-input"
              />
              <div className="register1-address-group">
                <div className="register1-address-field">
                  <label>Endereço</label>
                  <input
                    type="text"
                    name="rua"
                    placeholder="Endereço"
                    value={formData.rua}
                    onChange={handleChange}
                    className="register1-form-input"
                  />
                </div>
                <div className="register1-address-field">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numeroRua"
                    placeholder="Número"
                    value={formData.numeroRua}
                    onChange={handleChange}
                    className="register1-form-input"
                  />
                </div>
              </div>
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Estado</label>
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                value={formData.estado}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Telefone Primário</label>
              <input
                type="text"
                name="telefone"
                placeholder="Telefone Primário"
                value={formData.telefone}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Celular</label>
              <input
                type="text"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                className="register1-form-input"
              />
              <div className="register1-checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="profissionalDaSaude"
                    value="true"
                    checked={formData.profissionalDaSaude === true}
                    onChange={() => handleProfessionalChange(true)}
                  />
                  Sou um profissional da saúde
                </label>
                <label>
                  <input
                    type="radio"
                    name="profissionalDaSaude"
                    value="false"
                    checked={formData.profissionalDaSaude === false}
                    onChange={() => handleProfessionalChange(false)}
                  />
                  Não sou um profissional da saúde
                </label>
              </div>
              {showInfo && (
                <div className="info-box">
                  <p>
                    A plataforma Raízes foi desenvolvida para ser utilizada por
                    profissionais de saúde, com o objetivo de auxiliar na
                    identificação de indivíduos com alto risco de câncer
                    hereditário. Embora não seja impedido o uso por não
                    profissionais, é fundamental destacar que a interpretação
                    das informações fornecidas pela plataforma é facilitada
                    quando realizada com o suporte de um profissional de saúde.
                    Por isso, recomendamos fortemente que o uso e a aplicação
                    das informações sejam feitos sob acompanhamento de um
                    profissional qualificado.
                  </p>
                </div>
              )}
              <label>Graduação em</label>
              <input
                type="text"
                name="graduacao"
                placeholder="Graduação"
                value={formData.graduacao}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Pós-Graduação</label>
              <Select
                isMulti
                name="titulo"
                options={tituloOptions}
                value={tituloOptions.filter((option) =>
                  formData.titulo.includes(option.value)
                )}
                onChange={handleSelectChange}
                className="register1-form-input"
                classNamePrefix="select"
                placeholder="Selecione suas pós-graduações"
              />
              <label>Instituição</label>
              <input
                type="text"
                name="instituicao"
                placeholder="Instituição"
                value={formData.instituicao}
                onChange={handleChange}
                className="register1-form-input"
              />

              <div className="register1-actions">
                <button type="submit" className="register1-button">
                  Avançar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isRegister2Open && (
        <Register2
          isOpen={isRegister2Open}
          onClose={handleBack}
          formData={formData}
          onFinish={handleFinish}
        />
      )}
    </>
  );
}

Register1.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
