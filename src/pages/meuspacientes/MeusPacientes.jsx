import { useState, useEffect } from "react";
import "./MeusPacientes.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "../../components/Tooltip/Tooltip.jsx";
import DownloadIcon from "../../assets/download-box.svg"
import { useAuth } from "../../context/AuthContext.jsx";

export default function MeusPacientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pacientesPerPage = 10;

  const { idUser } = useAuth();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(
          `https://testserver-2p40.onrender.com/api/quiz/getPacientes/${idUser}`
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        const pacientesComRisco = data.map((paciente) => {
          paciente.consultaOncogenetica = paciente.risco
            ? "Paciente de alto risco"
            : "Não foram identificados critérios de alto risco";
          return paciente;
        });

        setPacientes(pacientesComRisco);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacientes();
  }, [idUser]);

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPaciente = currentPage * pacientesPerPage;
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(
    indexOfFirstPaciente,
    indexOfLastPaciente
  );

  const totalPages = Math.ceil(filteredPacientes.length / pacientesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getIcon = (sexo) => {
    if (sexo === "masculino") {
      return "👨";
    } else if (sexo === "feminino") {
      return "👩";
    }
    return "👤";
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  /* // Funções de ação para os botões
  const editarRelatorio = (pacienteId) => {
    console.log(`Editar relatório do paciente com ID: ${pacienteId}`);
    // Implementar lógica para abrir dadosPaciente com dados da API
  }; */

  const baixarRelatorio = async (pacienteId) => {
    console.log(`Baixar relatório do paciente com ID: ${pacienteId}`);

    toast.success("O download foi iniciado e terminará em poucos instantes!");

    try {
      // Chamada para obter o resultado do quiz
      const resultadoResponse = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/resultado/${pacienteId}/${idUser}`
      );

      if (!resultadoResponse.ok) {
        throw new Error(
          `Erro ao obter resultado do quiz: ${resultadoResponse.status}`
        );
      }

      const resultadoData = await resultadoResponse.json();
      console.log("Resultado do quiz:", resultadoData);
      const precisaPesquisaOncogenetica = resultadoData;

      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/${pacienteId}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao baixar relatório: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados do paciente:", data);

      // Adaptar os dados para o formato desejado
      const relatorio = {
        nome: data.usuariPrincipal.nome,
        idade: data.usuariPrincipal.idade,
        historicoPessoal: [],
        familiares: [],
        precisaPesquisaOncogenetica,
      };

      // Adicionar histórico pessoal de câncer do usuário principal
      if (data.usuariPrincipal.teveCancer) {
        relatorio.historicoPessoal.push(
          `${data.usuariPrincipal.qualCancer} aos ${data.usuariPrincipal.idadeDiagnostico} anos`
        );
      }

      // Adicionar outros tipos de câncer do usuário principal
      if (
        data.usuariPrincipal.outroCancerList &&
        data.usuariPrincipal.outroCancerList.length > 0
      ) {
        data.usuariPrincipal.outroCancerList.forEach((cancer) => {
          relatorio.historicoPessoal.push(
            `${cancer.tipoCancer} aos ${cancer.idadeDiagnostico} anos`
          );
        });
      }

      // Se não houver histórico de câncer
      if (relatorio.historicoPessoal.length === 0) {
        relatorio.historicoPessoal.push("Sem histórico pessoal de câncer");
      }

      // O restante do código permanece o mesmo...

      // Enviar os dados formatados para o endpoint desejado
      const pdfResponse = await fetch(
        "https://testserver-2p40.onrender.com/generatepdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relatorio),
        }
      );

      if (!pdfResponse.ok) {
        throw new Error(`Erro ao gerar PDF: ${pdfResponse.status}`);
      }

      // Aqui obtemos o blob do PDF
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);

      // Criar um elemento <a> para iniciar o download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Relatorio_${relatorio.nome}.pdf`;

      document.body.appendChild(a);
      a.click();

      // Remover o link do DOM após o download
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Download finalizado!");
    } catch (error) {
      console.error(`Erro ao baixar o relatório: ${error}`);
      toast.error("Erro ao realizar download de relatório!");
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{`Ocorreu um erro: ${error}`}</p>;
  }

  const formatCancerTypes = (paciente) => {
    let cancerTypes = [];
    if (paciente.tipoCancer) {
      cancerTypes.push(paciente.tipoCancer);
    }
    if (paciente.outroCancerList && paciente.outroCancerList.length > 0) {
      cancerTypes = cancerTypes.concat(
        paciente.outroCancerList.map((cancer) => cancer.tipoCancer)
      );
    }
    return cancerTypes.length > 0
      ? cancerTypes.join(", ")
      : "Sem histórico de câncer/neoplasia";
  };

  return (
    <div>
      <ToastContainer />
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
                </span>
                <span>Tipo de Câncer: {formatCancerTypes(paciente)}</span>
              </div>
              <div className="divider"></div>
              <div className="report-buttons">
                <Tooltip text="Baixar relatório">
                  <button className="btn-relatorio"
                    onClick={() => baixarRelatorio(paciente.idQuestionario)}
                  >
                    <img src={DownloadIcon} alt="Baixar relatório" />
                  </button>
                </Tooltip>
              </div>

              <div className="divider"></div>
              <div className="consulta-oncogenetica">
                {paciente.consultaOncogenetica === "Paciente de alto risco" ? (
                  <span className="alto-risco">
                    {paciente.consultaOncogenetica}
                  </span>
                ) : paciente.consultaOncogenetica ===
                  "Não foram identificados critérios de alto risco" ? (
                  <span className="baixo-risco">
                    {paciente.consultaOncogenetica}
                  </span>
                ) : (
                  <span className="sem-consulta">
                    {paciente.consultaOncogenetica}
                  </span>
                )}
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
    </div>
  );
}
