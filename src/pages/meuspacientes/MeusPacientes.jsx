import { useState, useEffect } from "react";
import "./MeusPacientes.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "../../components/Tooltip/Tooltip.jsx";
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
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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
      console.log("Resultado do quiz:", resultadoData); // Log da resposta do quiz
      const precisaPesquisaOncogenetica = resultadoData; // Isso deve ser true ou false

      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/${pacienteId}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao baixar relatório: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados do paciente:", data); // Log da resposta dos dados do paciente

      // Adaptar os dados para o formato desejado
      const relatorio = {
        nome: data.usuariPrincipal.nome,
        idade: data.usuariPrincipal.idade,
        historicoPessoal: `${data.usuariPrincipal.qualCancer} aos ${data.usuariPrincipal.idadeDiagnostico} anos`,
        familiares: [],
        precisaPesquisaOncogenetica, // Adiciona o resultado do quiz aqui
      };

      // Adicionar informações do pai
      if (data.pai.teveCancer) {
        relatorio.familiares.push({
          grau: "pai",
          tipoCancer:
            data.pai.outroCancerList.length > 0
              ? data.pai.outroCancerList[0].tipoCancer
              : "desconhecido",
          idadeDiagnostico:
            data.pai.outroCancerList.length > 0
              ? data.pai.outroCancerList[0].idadeDiagnostico
              : 0,
        });
      }

      // Adicionar informações da mãe
      if (data.mae.teveCancer) {
        relatorio.familiares.push({
          grau: "mãe",
          tipoCancer:
            data.mae.outroCancerList.length > 0
              ? data.mae.outroCancerList[0].tipoCancer
              : "desconhecido",
          idadeDiagnostico:
            data.mae.outroCancerList.length > 0
              ? data.mae.outroCancerList[0].idadeDiagnostico
              : 0,
        });
      }

      // Adicionar informações dos filhos
      data.filhosList.forEach((filho) => {
        if (filho.teveCancer) {
          relatorio.familiares.push({
            grau: "filho",
            tipoCancer:
              filho.outroCancerList.length > 0
                ? filho.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              filho.outroCancerList.length > 0
                ? filho.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos netos
      data.netosList.forEach((neto) => {
        if (neto.teveCancer) {
          relatorio.familiares.push({
            grau: "neto",
            tipoCancer:
              neto.outroCancerList.length > 0
                ? neto.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              neto.outroCancerList.length > 0
                ? neto.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos irmãos
      data.irmaosList.forEach((irmao) => {
        if (irmao.teveCancer) {
          relatorio.familiares.push({
            grau: "irmão",
            tipoCancer:
              irmao.outroCancerList.length > 0
                ? irmao.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              irmao.outroCancerList.length > 0
                ? irmao.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos sobrinhos
      data.sobrinhosList.forEach((sobrinho) => {
        if (sobrinho.teveCancer) {
          relatorio.familiares.push({
            grau: "sobrinho",
            tipoCancer:
              sobrinho.outroCancerList.length > 0
                ? sobrinho.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              sobrinho.outroCancerList.length > 0
                ? sobrinho.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos tios
      data.tiosList.forEach((tio) => {
        if (tio.teveCancer) {
          relatorio.familiares.push({
            grau: "tio",
            tipoCancer:
              tio.outroCancerList.length > 0
                ? tio.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              tio.outroCancerList.length > 0
                ? tio.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos avós
      data.avosList.forEach((avo) => {
        if (avo.teveCancer) {
          relatorio.familiares.push({
            grau: "avô",
            tipoCancer:
              avo.outroCancerList.length > 0
                ? avo.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              avo.outroCancerList.length > 0
                ? avo.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações dos primos
      data.primosList.forEach((primo) => {
        if (primo.teveCancer) {
          relatorio.familiares.push({
            grau: "primo",
            tipoCancer:
              primo.outroCancerList.length > 0
                ? primo.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              primo.outroCancerList.length > 0
                ? primo.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

      // Adicionar informações de outros familiares
      data.outroFamiliarList.forEach((familiar) => {
        if (familiar.teveCancer) {
          relatorio.familiares.push({
            grau: familiar.qualFamiliar,
            tipoCancer:
              familiar.outroCancerList.length > 0
                ? familiar.outroCancerList[0].tipoCancer
                : "desconhecido",
            idadeDiagnostico:
              familiar.outroCancerList.length > 0
                ? familiar.outroCancerList[0].idadeDiagnostico
                : 0,
          });
        }
      });

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
      const blob = await pdfResponse.blob(); // Obtemos o blob do PDF
      const url = window.URL.createObjectURL(blob); // Criamos uma URL para o blob

      // Criar um elemento <a> para iniciar o download
      const a = document.createElement("a");
      a.style.display = "none"; // Esconder o link
      a.href = url; // Definimos o URL do blob como o href do link
      a.download = `Relatorio_${relatorio.nome}.pdf`; // Definimos o atributo download

      document.body.appendChild(a); // Adicionamos o link ao documento
      a.click(); // Simulamos um clique no link para iniciar o download

      // Remover o link do DOM após o download
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Limpa o URL blob

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
                <Tooltip text="Abrir resultado">
                  <button
                    onClick={() => abrirRelatorio(paciente.idQuestionario)}
                  >
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
