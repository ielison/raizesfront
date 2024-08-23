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
    cidade: "",
    estado: "",
    endereco: "",
    telefonePrimario: "",
    celular: "",
    profissionalSaude: false,
    naoProfissionalSaude: false,
    graduacao: "",
    titulo: "",
    instituicao: "",
  });

  const [isRegister2Open, setRegister2Open] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
            endereco: data.logradouro || "",
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
    // Implement navigation to registerEnd modal here
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
            <div className="register1-stepper">
              <div className="register1-step register1-active">Informações Básicas</div>
              <div className="register1-step register1-inactive">
                <span className="register1-dotted-line"></span>
                Segunda Etapa
              </div>
            </div>
            <form onSubmit={handleAdvance}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar Senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="pais"
                placeholder="País"
                value={formData.pais}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCEPBlur}
                className="register1-form-input"
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                value={formData.estado}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="telefonePrimario"
                placeholder="Telefone Primário"
                value={formData.telefonePrimario}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                className="register1-form-input"
              />
              <div className="register1-checkbox-group">
                <input
                  type="checkbox"
                  name="profissionalSaude"
                  checked={formData.profissionalSaude}
                  onChange={handleChange}
                />
                <label>Sou um profissional da saúde</label>
              </div>
              <div className="register1-checkbox-group">
                <input
                  type="checkbox"
                  name="naoProfissionalSaude"
                  checked={formData.naoProfissionalSaude}
                  onChange={handleChange}
                />
                <label>Não sou um profissional da saúde</label>
                <span className="register1-info-button">ℹ️</span>
                <div className="tooltip-text">
                  Ao selecionar essa opção você está ciente de que os resultados...
                </div>
              </div>
              <input
                type="text"
                name="graduacao"
                placeholder="Graduação"
                value={formData.graduacao}
                onChange={handleChange}
                className="register1-form-input"
              />
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
                className="register1-form-input"
              />
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
