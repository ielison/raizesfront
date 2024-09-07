import { useState } from "react";
import PropTypes from "prop-types";
import Register2 from "../Register2/Register2"; // Import Register2 component
import "./Register1.css";

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
    titulo: "",
    instituicao: "",
  });

  const [isRegister2Open, setRegister2Open] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    setRegister2Open(true);
  };

  const handleBack = () => {
    setRegister2Open(false);
  };

  const handleFinish = () => {
    console.log("Finalizing registration with data:", formData);
  };

  return (
    <>
      {!isRegister2Open && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="register1-modal" onClick={(e) => e.stopPropagation()}>
            <div className="register1-header">
              <h2>Registrar</h2>
              <button className="register1-close-button" onClick={onClose}>
                X
              </button>
            </div>
            <p>Informe seus dados para criar uma conta.</p>
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
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Sobrenome</label>
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar Senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>País</label>
              <input
                type="text"
                name="pais"
                placeholder="País"
                value={formData.pais}
                onChange={handleChange}
                className="register1-form-input"
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
                    value="true" // Corrigido para string "true"
                    checked={formData.profissionalDaSaude === true}
                    onChange={() =>
                      setFormData({ ...formData, profissionalDaSaude: true })
                    } // Atualiza o valor para true diretamente
                  />
                  Sou um profissional da saúde
                </label>
                <label>
                  <input
                    type="radio"
                    name="profissionalDaSaude"
                    value="false" // Corrigido para string "false"
                    checked={formData.profissionalDaSaude === false}
                    onChange={() =>
                      setFormData({ ...formData, profissionalDaSaude: false })
                    } // Atualiza o valor para false diretamente
                  />
                  Não sou um profissional da saúde
                </label>

                <span
                  className="register1-info-button"
                  onClick={() => setShowInfo(!showInfo)} // Toggle info box visibility
                >
                  ℹ️
                </span>
              </div>
              {showInfo && (
                <div className="info-box">
                  A plataforma Raízes foi desenvolvida para ser utilizada por
                  profissionais de saúde, com o objetivo de auxiliar na
                  identificação de indivíduos com alto risco de câncer
                  hereditário. Embora não seja impedido o uso por não
                  profissionais, é fundamental destacar que a interpretação das
                  informações fornecidas pela plataforma é facilitada quando
                  realizada com o suporte de um profissional de saúde. Por isso,
                  recomendamos fortemente que o uso e a aplicação das
                  informações sejam feitos sob acompanhamento de um profissional
                  qualificado.
                </div>
              )}
              <label>Graduação</label>
              <input
                type="text"
                name="graduacao"
                placeholder="Graduação"
                value={formData.graduacao}
                onChange={handleChange}
                className="register1-form-input"
              />
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
                className="register1-form-input"
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
              <button type="submit" className="register1-form-button">
                Avançar
              </button>
            </form>
          </div>
        </div>
      )}
      <Register2
        isOpen={isRegister2Open}
        onClose={handleBack}
        formData={formData}
        onFinish={handleFinish}
      />
    </>
  );
}

Register1.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
