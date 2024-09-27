import { useState, useEffect } from "react";
import "./MeusPacientes.css";
import Tooltip from "../../components/Tooltip/Tooltip.jsx";
import { useAuth } from "../../context/AuthContext.jsx"; // Importa o contexto para obter o idUser

export default function MeusPacientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pacientes, setPacientes] = useState([]); // Estado para armazenar os pacientes
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para captura de erros
  const pacientesPerPage = 10;

  const { idUser } = useAuth(); // Use the custom hook to access context

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(
          `https://testserver-2p40.onrender.com/api/quiz/getPacientes/${idUser}`
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`); // Lida com erros HTTP
        }

        const data = await response.json(); // Converte a resposta em JSON

        // Faz uma chamada adicional para verificar a consulta oncogenética de cada paciente
        const pacientesComConsulta = await Promise.all(
          data.map(async (paciente) => {
            try {
              const consultaResponse = await fetch(
                `https://testserver-2p40.onrender.com/api/quiz/resultado/${paciente.idQuestionario}/${idUser}`
              );

              if (consultaResponse.ok) {
                const consultaData = await consultaResponse.json();
                paciente.consultaOncogenetica = consultaData
                  ? "Precisa consulta oncogenética"
                  : "Não precisa consulta oncogenética";
              } else {
                paciente.consultaOncogenetica = "Não precisa consulta oncogenética";
              }
            } catch (error) {
              console.error(`Erro ao verificar consulta oncogenética: ${error}`);
              paciente.consultaOncogenetica = "Não precisa consulta oncogenética";
            }

            return paciente;
          })
        );

        setPacientes(pacientesComConsulta); // Armazena os pacientes com consulta oncogenética
      } catch (error) {
        setError(error.message); // Define a mensagem de erro
      } finally {
        setIsLoading(false); // Finaliza o loading
      }
    };

    fetchPacientes(); // Chama a função para buscar os pacientes
  }, [idUser]); // Dependência de idUser para refazer a chamada caso mude

  // Filtrar pacientes com base no termo de busca
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular o índice do primeiro e do último paciente na página atual
  const indexOfLastPaciente = currentPage * pacientesPerPage;
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(
    indexOfFirstPaciente,
    indexOfLastPaciente
  );

  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredPacientes.length / pacientesPerPage);

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Função para retornar o ícone baseado no gênero
  const getIcon = (sexo) => {
    if (sexo === "masculino") {
      return "👨"; // Ícone para homem
    } else if (sexo === "feminino") {
      return "👩"; // Ícone para mulher
    }
    return "👤"; // Ícone padrão
  };

  // Função para formatar a data para o formato DD/MM/AAAA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Obtém o dia e adiciona zero à esquerda se necessário
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtém o mês e adiciona zero à esquerda
    const year = date.getFullYear(); // Obtém o ano
    return `${day}/${month}/${year}`; // Retorna a data formatada
  };

  // Funções de ação para os botões
  const abrirRelatorio = (pacienteId) => {
    console.log(`Abrir relatório do paciente com ID: ${pacienteId}`);
    // Implementar lógica para abrir modal relatórioPaciente
  };

  const editarRelatorio = (pacienteId) => {
    console.log(`Editar relatório do paciente com ID: ${pacienteId}`);
    // Implementar lógica para abrir dadosPaciente com dados da API
  };

  const baixarRelatorio = (pacienteId) => {
    console.log(`Baixar relatório do paciente com ID: ${pacienteId}`);
    // Implementar lógica para download do relatório
  };

  if (isLoading) {
    return <p>Carregando...</p>; // Mensagem de carregamento
  }

  if (error) {
    return <p>{`Ocorreu um erro: ${error}`}</p>; // Mensagem de erro
  }

  return (
    <div className="meus-pacientes">
      <h1 className="h1-pacientes">Meus Pacientes</h1>
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
      <div className="pacientes-list">
        {currentPacientes.map((paciente) => (
          <div key={paciente.idQuestionario} className="paciente-card">
            <div className="paciente-info">
              <div className="paciente-icon">{getIcon(paciente.sexo)}</div>
              <div className="paciente-details">
                <span className="paciente-nome">{paciente.nome}</span>
                <span className="paciente-idade">{paciente.idade} anos</span>
              </div>
            </div>
            <div className="divider"></div>
            <div className="paciente-contato">
              <span>Contato: {paciente.contato}</span>
              <span>
                Data da Consulta: {formatDate(paciente.dataConsulta)}
              </span>{" "}
              {/* Formata a data */}
              <span>
                Tipo de Câncer:{" "}
                {paciente.tipoCancer || "Sem histórico de câncer/neoplasia"}
              </span>{" "}
              {/* Condição para exibir texto padrão */}
            </div>
            <div className="divider"></div>
            <div className="report-buttons">
              <Tooltip text="Abrir relatório">
                <button onClick={() => abrirRelatorio(paciente.idQuestionario)}>
                  📄
                </button>
              </Tooltip>
              <Tooltip text="Editar relatório">
                <button
                  onClick={() => editarRelatorio(paciente.idQuestionario)}
                >
                  ✏️
                </button>
              </Tooltip>
              <Tooltip text="Baixar relatório">
                <button
                  onClick={() => baixarRelatorio(paciente.idQuestionario)}
                >
                  ⬇️
                </button>
              </Tooltip>
            </div>

            <div className="divider"></div>
            <div className="consulta-oncogenetica">
              {paciente.consultaOncogenetica}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
