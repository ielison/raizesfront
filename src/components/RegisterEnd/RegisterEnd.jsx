import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterEnd.css";

export default function RegisterEnd() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para a página /home após 2 segundos
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer); // Limpa o timer quando o componente desmonta
  }, [navigate]);

  return (
    <div className="register-end-container">
      <div className="checkmark-circle">
        <div className="checkmark"></div>
      </div>
      <h2>Cadastro Finalizado!</h2>
    </div>
  );
}
