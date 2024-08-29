import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext"; // Importing AuthContext
import "./LoginModal.css";
import { useState } from "react";

export default function LoginModal({ isOpen, onClose, handleRegisterClick }) {
  const navigate = useNavigate();
  const { login } = useAuth(); // Using the login function from AuthContext
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Example login logic (you would typically verify against an API)
    if (email === "user@example.com" && password === "password") {
      login(); // Set login state to true
      navigate("/home"); // Navigate to home
    } else {
      setErrorMessage("E-mail ou senha inválidos."); // Show error message
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close-button" onClick={onClose}>
          &times; {/* Close button with "x" */}
        </button>
        <h2>Olá, seja bem-vindo!</h2>
        <p>
          Identificar e gerenciar pacientes de alto risco de câncer é crucial para oferecer cuidados personalizados e eficazes.
          Com nossa ferramenta, você tem acesso rápido e seguro aos dados dos seus pacientes, permitindo que você tome decisões informadas e assertivas.
          Agradecemos sua dedicação em cuidar da saúde não só dos seus pacientes, mas também das suas famílias!
        </p>
        <p>
          Realize login abaixo para iniciar um novo questionário de avaliação ou acessar as informações dos seus pacientes e continuar a fornecer o melhor cuidado possível:
        </p>
        
        {errorMessage && <p className="login-modal-error-message">{errorMessage}</p>} {/* Display error message */}

        <form onSubmit={handleLoginSubmit}>
          <div className="login-modal-form-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" name="email" placeholder="Informe o seu e-mail" required />
          </div>
          <div className="login-modal-form-group">
            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" name="password" placeholder="Digite a sua senha" required />
          </div>
          <a href="#" className="login-modal-forgot-password">Esqueci a senha</a> {/* Link for forgot password */}
          <div className="login-modal-submit-button-container">
            <button type="submit" className="login-modal-submit-button">Entrar</button>
          </div>
        </form>
        <p className="login-modal-register-prompt">
          Ainda não possui uma conta?{" "}
          <span className="login-modal-register-link" onClick={handleRegisterClick}>Registre-se aqui</span> {/* Register link */}
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
