import PropTypes from "prop-types";
import "./Register2.css"; // Estilos para o componente
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";

const Register2 = ({ isOpen, onClose, formData }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { login } = useAuth();

//ok
  
  // Estados locais
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(false);
  const [subscribeUpdates, setSubscribeUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (e) => {
    e.preventDefault(); // Prevenir o envio padrão do formulário
  
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Por favor, preencha todos os campos obrigatórios: Nome, Email e Senha.");
      return;
    }
  
    // Verifica se os termos foram aceitos
    if (!acceptedTerms) {
      alert("Você deve aceitar os termos para continuar.");
      return;
    }
  
    // Preparar os dados do usuário
    const userData = {
      usuarioId: 0,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      cep: formData.cep,
      pais: formData.pais,
      cidade: formData.cidade,
      rua: formData.rua,
      numeroRua: formData.numeroRua || "",
      telefone: formData.telefone,
      celular: formData.celular,
      profissionalDaSaude: formData.profissionalDaSaude,
      graduacao: formData.graduacao,
      receberEmail: subscribeNews,
    };
  
    //console.log("Payload enviado para a API:", userData);
  
    try {
      setIsLoading(true); // Inicia o carregamento
      // Enviar dados para a API local
      const response = await axios.post(
        "https://testserver-2p40.onrender.com/api/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Para evitar ataques CSRF
          },
          timeout: 10000, // Timeout de 10 segundos
        }
      );
  
      //console.log("Resposta da API ao registrar o usuário:", response);
  
      // Verifica se o status da resposta é 204 (sem conteúdo)
      if (response.status === 204) {
        //console.log("Usuário registrado com sucesso. Aguardando para fazer login...");
  
        // Delay antes do login
        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos
  
        // Realiza o login após a confirmação do registro
        const loginResponse = await axios.get(
          "https://testserver-2p40.onrender.com/api/login", {
            params: { email: formData.email, senha: formData.senha }, // Envia os dados necessários
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
  
        //console.log("Resposta da API ao fazer login:", loginResponse);
  
        // Verifica se o login foi bem-sucedido
        if (loginResponse.status === 200) {
          const { idUser, nome } = loginResponse.data;
          //console.log("Login bem-sucedido. ID do usuário:", idUser);
          setUser({ nome }); // Atualiza o estado do usuário
          login(idUser, nome); // Passa idUser e nome para useAuth
          navigate("/home");
        } else {
          alert("Houve um erro ao fazer login. Por favor, tente novamente.");
        }
      } else {
        alert("Houve um erro ao registrar o usuário. Por favor, tente novamente.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro ao registrar usuário:", error.response.data);
        alert(
          "Erro: " + (error.response.data.message || "Não foi possível registrar o usuário. Tente novamente mais tarde.")
        );
      } else {
        console.error("Erro ao registrar usuário:", error.message || error);
        alert("Não foi possível registrar o usuário. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };
  
  if (!isOpen) return null; // Se não estiver aberto, não renderiza nada

  return (
    <div className="register2-modal-overlay" onClick={onClose}>
      <div
        className="register2-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="register2-header">
          <h2>Dados de Cadastro</h2>
          <button className="register2-close-button" onClick={onClose}>
            X
          </button>
        </div>
        <p>Por favor, confirme as informações</p>
        <div className="stepper-wrapper">
          <div className="stepper-item completed">
            <div className="step-counter">1</div>
            <div className="step-name">Informações Básicas</div>
          </div>
          <div className="stepper-item active">
            <div className="step-counter">2</div>
            <div className="step-name">Segunda Etapa</div>
          </div>
        </div>
        <div className="register2-confirmation-table">
          {/* Exibição dos dados do formulário */}
          <div>
            <strong>Primeiro Nome:</strong> {formData.nome}
          </div>
          <div>
            <strong>Sobrenome:</strong> {formData.sobrenome}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>Título:</strong> {formData.titulo}
          </div>
          <div>
            <strong>Graduação:</strong> {formData.graduacao}
          </div>
          <div>
            <strong>Instituição:</strong> {formData.instituicao}
          </div>
          <div>
            <strong>Profissional de Saúde:</strong>{" "}
            {formData.profissionalDaSaude ? "Sim" : "Não"}
          </div>
          <div>
            <strong>País:</strong> {formData.pais}
          </div>
          <div>
            <strong>Estado:</strong> {formData.estado}
          </div>
          <div>
            <strong>CEP:</strong> {formData.cep}
          </div>
          <div>
            <strong>Rua:</strong> {formData.rua}
          </div>
          <div>
            <strong>Número:</strong> {formData.numeroRua}
          </div>
          <div>
            <strong>Cidade:</strong> {formData.cidade}
          </div>
          <div>
            <strong>Tel. Primário:</strong> {formData.telefone}
          </div>
          <div>
            <strong>Celular:</strong> {formData.celular}
          </div>
        </div>
        <div className="register2-terms-section">
          <h3>Leia e aceite os termos de usuário</h3>
          <div className="register2-terms-box">
            <p>
              Ao utilizar a plataforma raízes, você, o usuário, concorda com os
              seguintes termos e condições:
              <br />
              Uso Autorizado: Você se compromete a usar esta plataforma apenas
              para fins legais e de acordo com as políticas estabelecidas.
              <br />
              Privacidade: Seu uso a plataforma está sujeito à nossa Política de
              Privacidade, que explica como coletamos e usamos suas informações
              pessoais.
              <br />
              Propriedade Intelectual: O conteúdo da plataforma são protegidos
              por leis de direitos autorais e não podem ser copiados sem
              permissão expressa.
              <br />
              Limitações de Responsabilidade: Não nos responsabilizamos por
              danos diretos, indiretos, incidentais ou consequentes resultantes
              do uso, ou da incapacidade de usar a ferramenta.
              <br />
              Modificações: Reservamo-nos o direito de alterar estes termos a
              qualquer momento. As alterações entram em vigor imediatamente após
              a publicação.
              <br />
              Ao clicar em &quot;Aceitar&quot; ou ao continuar a utilizar a
              ferramenta, você reconhece que leu, entendeu e concordou em estar
              vinculado a estes termos.
            </p>
          </div>
          <div className="input-reg2">
            <input
              type="checkbox"
              id="accept-terms"
              required
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms((prev) => !prev)}
              aria-labelledby="accept-terms-label"
            />
            <label id="accept-terms-label" htmlFor="accept-terms">
              Aceito os termos de usuário conforme apresentado
            </label>
          </div>
          <div className="input-reg2">
            <input
              type="checkbox"
              id="subscribe-news"
              checked={subscribeNews}
              onChange={() => setSubscribeNews((prev) => !prev)}
              aria-labelledby="subscribe-news-label"
            />
            <label id="subscribe-news-label" htmlFor="subscribe-news">
              Gostaria de receber e-mails do Raízes, como resultados e notícias
              da ferramenta.
            </label>
          </div>
          <div className="input-reg2">
            <input
              type="checkbox"
              id="subscribe-updates"
              checked={subscribeUpdates}
              onChange={() => setSubscribeUpdates((prev) => !prev)}
              aria-labelledby="subscribe-updates-label"
            />
            <label id="subscribe-updates-label" htmlFor="subscribe-updates">
              Em caso de atualizações sobre o cálculo de risco, gostaria de ser
              notificado sobre mudança.
            </label>
          </div>
        </div>
        <div className="register2-buttons-section">
          <button onClick={onClose} className="register2-back-button">
            Voltar
          </button>
          <button
            onClick={handleFinish}
            className={`register2-finish-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Finalizar Cadastro"}
          </button>
        </div>
      </div>
    </div>
  );
};

Register2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    senha: PropTypes.string.isRequired,
    cep: PropTypes.string,
    pais: PropTypes.string,
    estado: PropTypes.string,
    cidade: PropTypes.string,
    rua: PropTypes.string,
    numeroRua: PropTypes.string,
    telefone: PropTypes.string,
    celular: PropTypes.string,
    profissionalDaSaude: PropTypes.bool,
    graduacao: PropTypes.string,
    instituicao: PropTypes.string,
    sobrenome: PropTypes.string,
    titulo: PropTypes.string,
  }).isRequired,
};

export default Register2;
