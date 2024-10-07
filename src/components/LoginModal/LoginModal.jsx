import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext"; // Importando AuthContext
import "./LoginModal.css";
import { useState } from "react";
import closedEyeIcon from "../../assets/closed-eye.svg";
import openEyeIcon from "../../assets/open-eye.svg";

export default function LoginModal({ isOpen, onClose, handleRegisterClick }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/login?email=${encodeURIComponent(
          email
        )}&senha=${encodeURIComponent(password)}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        login(data.idUser, data.nome);
        onClose(); // Close the modal
        navigate("/home"); // Redirect to home page
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "E-mail ou senha inválidos.");
      }
    } catch (error) {
      setErrorMessage("Erro ao realizar login. Tente novamente.");
      console.error("Erro ao realizar login:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <button className="login-modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Olá, seja bem-vindo!</h2>
        <p>
          Identificar e gerenciar pacientes de alto risco de câncer é crucial
          para oferecer cuidados personalizados e eficazes. Com nossa
          ferramenta, você tem acesso rápido e seguro aos dados dos seus
          pacientes, permitindo que você tome decisões informadas e assertivas.
          Agradecemos sua dedicação em cuidar da saúde não só dos seus
          pacientes, mas também das suas famílias!
        </p>
        <p>
          Realize login abaixo para iniciar um novo questionário de avaliação ou
          acessar as informações dos seus pacientes e continuar a fornecer o
          melhor cuidado possível:
        </p>
        {errorMessage && (
          <p className="login-modal-error-message">{errorMessage}</p>
        )}
        <form onSubmit={handleLoginSubmit}>
          <div className="login-modal-form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Informe o seu e-mail"
              required
            />
          </div>
          <div className="login-modal-form-group">
            <label htmlFor="password">Senha:</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Digite a sua senha"
                required
              />
              <button
                type="button"
                className="toggle-password-visibility"
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                <img
                  src={passwordVisible ? closedEyeIcon : openEyeIcon}
                  alt={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
                />
              </button>
            </div>
          </div>
          <a href="#" className="login-modal-forgot-password">
            Esqueci a senha
          </a>
          <div className="login-modal-submit-button-container">
            <button type="submit" className="login-modal-submit-button">
              Entrar
            </button>
          </div>
        </form>
        <p className="login-modal-register-prompt">
          Ainda não possui uma conta?{" "}
          <span
            className="login-modal-register-link"
            onClick={handleRegisterClick}
          >
            Registre-se aqui
          </span>
        </p>
      </div>
    </div>
  );
}

// PropTypes for type checking
LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleRegisterClick: PropTypes.func.isRequired,
};
