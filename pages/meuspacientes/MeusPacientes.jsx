import { useState } from "react";
import "./MeusPacientes.css";
import pacientesData from "../../data/pacientes.js";
import Tooltip from "../../components/Tooltip/Tooltip.jsx";

export default function MeusPacientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pacientesPerPage = 10;

  // Filtrar pacientes com base no termo de busca
  const filteredPacientes = pacientesData.filter((paciente) =>
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
    if (sexo === "M") {
      return "👨"; // Ícone para homem
    } else if (sexo === "F") {
      return "👩"; // Ícone para mulher
    }
    return "👤"; // Ícone padrão
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
          <div key={paciente.id} className="paciente-card">
            <div className="paciente-info">
              <div className="paciente-icon">{getIcon(paciente.sexo)}</div>
              <div className="paciente-details">
                <span className="paciente-nome">{paciente.nome}</span>
                <span className="paciente-idade">{paciente.idade} anos</span>
              </div>
            </div>
            <div className="divider"></div>
            <div className="paciente-contato">
              <span>Contato: {paciente.telefone}</span>
              <span>Data da Consulta: {paciente.dataConsulta}</span>
              <span>Tipo de Neoplasia: {paciente.tipoCancer}</span>
            </div>
            <div className="divider"></div>
            <div className="report-buttons">
              <Tooltip text="Abrir relatório">
                <button onClick={() => abrirRelatorio(paciente.id)}>📄</button>
              </Tooltip>
              <Tooltip text="Editar relatório">
                <button onClick={() => editarRelatorio(paciente.id)}>✏️</button>
              </Tooltip>
              <Tooltip text="Baixar relatório">
                <button onClick={() => baixarRelatorio(paciente.id)}>⬇️</button>
              </Tooltip>
            </div>

            <div className="divider"></div>
            <div className="consulta-oncogenetica">
              {paciente.consultaOncogenetica
                ? "Alto risco"
                : "Não foram encontrados critérios de alto risco."}
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
