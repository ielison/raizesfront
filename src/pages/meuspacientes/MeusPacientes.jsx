import { useState, useEffect } from "react";
import "./MeusPacientes.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "../../components/Tooltip/Tooltip.jsx";
import DownloadIcon from "../../assets/download-box.svg";
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
    //console.log(`Baixar relatório do paciente com ID: ${pacienteId}`);

    toast.success("O download foi iniciado e terminará em poucos instantes!");

    try {
      // Log: Data being sent to API
      //console.log("Dados enviados para a API:", { pacienteId, idUser });

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
      //console.log("Resultado do quiz recebido da API:", resultadoData);
      const precisaPesquisaOncogenetica = resultadoData;

      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/${pacienteId}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao baixar relatório: ${response.status}`);
      }

      const data = await response.json();
      //console.log("Dados do paciente recebidos da API:", data);

      // Função auxiliar para formatar o histórico de câncer
      const formatarHistoricoCancer = (familiar) => {
        if (!familiar || !familiar.teveCancer) return [];
        let historico = [];
        if (familiar.qualCancer && familiar.idadeDiagnostico) {
          historico.push(`${familiar.qualCancer} aos ${familiar.idadeDiagnostico} anos`);
        }
        if (familiar.outroCancerList && familiar.outroCancerList.length > 0) {
          familiar.outroCancerList.forEach(cancer => {
            historico.push(`${cancer.tipoCancer} aos ${cancer.idadeDiagnostico} anos`);
          });
        }
        return historico;
      };

      // Função auxiliar para adicionar familiares ao relatório
      const adicionarFamiliares = (familiares, tipo) => {
        let familiaresFormatados = [];
        familiares.forEach((familiar, index) => {
          if (familiar.teveCancer) {
            const historico = formatarHistoricoCancer(familiar);
            historico.forEach(h => {
              const [tipoCancer, idade] = h.split(' aos ');
              let grau = tipo;
              if (tipo === 'Filho(a)') {
                grau = familiar.sexo === 'masculino' ? 'Filho' : 'Filha';
              } else if (tipo === 'Neto(a)') {
                grau = familiar.sexo === 'masculino' ? 'Neto' : 'Neta';
              }
              familiaresFormatados.push({
                grau: `${grau} ${index + 1}`,
                tipoCancer: tipoCancer,
                idadeDiagnostico: parseInt(idade)
              });
            });
          }
        });
        return familiaresFormatados;
      };

      // Adaptar os dados para o formato esperado pelo servidor
      const relatorio = {
        nome: data.usuariPrincipal.nome,
        idade: data.usuariPrincipal.idade,
        historicoPessoal: formatarHistoricoCancer(data.usuariPrincipal).join(', '),
        familiares: [],
        precisaPesquisaOncogenetica,
        temFamiliaresComCancer: false
      };

      // Se não houver histórico de câncer
      if (relatorio.historicoPessoal.length === 0) {
        relatorio.historicoPessoal = "Sem histórico pessoal de câncer";
      }

      // Adicionar histórico familiar
      if (data.mae && data.mae.teveCancer) {
        relatorio.familiares.push(...formatarHistoricoCancer(data.mae).map(h => {
          const [tipoCancer, idade] = h.split(' aos ');
          return { grau: 'Mãe', tipoCancer, idadeDiagnostico: parseInt(idade) };
        }));
      }
      if (data.pai && data.pai.teveCancer) {
        relatorio.familiares.push(...formatarHistoricoCancer(data.pai).map(h => {
          const [tipoCancer, idade] = h.split(' aos ');
          return { grau: 'Pai', tipoCancer, idadeDiagnostico: parseInt(idade) };
        }));
      }
      relatorio.familiares.push(...adicionarFamiliares(data.filhosList || [], 'Filho(a)'));
      relatorio.familiares.push(...adicionarFamiliares(data.netosList || [], 'Neto(a)'));
      relatorio.familiares.push(...adicionarFamiliares(data.irmaosList || [], 'Irmão(ã)'));
      relatorio.familiares.push(...adicionarFamiliares(data.sobrinhosList || [], 'Sobrinho(a)'));
      
      // Adicionar tios maternos e paternos
      if (data.tiosList) {
        data.tiosList.forEach((tio, index) => {
          if (tio.teveCancer) {
            const historico = formatarHistoricoCancer(tio);
            historico.forEach(h => {
              const [tipoCancer, idade] = h.split(' aos ');
              const grau = tio.sexo === 'masculino' ? 'Tio' : 'Tia';
              relatorio.familiares.push({
                grau: `${grau} ${tio.ladoPaterno ? 'do lado paterno' : 'do lado materno'}`,
                tipoCancer: tipoCancer,
                idadeDiagnostico: parseInt(idade)
              });
            });
          }
        });
      }

      // Adicionar avós maternos e paternos
      if (data.avosList) {
        data.avosList.forEach((avo, index) => {
          if (avo.teveCancer) {
            const historico = formatarHistoricoCancer(avo);
            historico.forEach(h => {
              const [tipoCancer, idade] = h.split(' aos ');
              const grau = avo.sexo === 'masculino' ? 'Avô' : 'Avó';
              relatorio.familiares.push({
                grau: `${grau} ${avo.ladoPaterno === 'paterno' ? 'do lado paterno' : 'do lado materno'}`,
                tipoCancer: tipoCancer,
                idadeDiagnostico: parseInt(idade)
              });
            });
          }
        });
      }

      // Adicionar primos maternos e paternos
      if (data.primosList) {
        data.primosList.forEach((primo, index) => {
          if (primo.teveCancer) {
            const historico = formatarHistoricoCancer(primo);
            historico.forEach(h => {
              const [tipoCancer, idade] = h.split(' aos ');
              const grau = primo.sexo === 'masculino' ? 'Primo' : 'Prima';
              relatorio.familiares.push({
                grau: `${grau} ${primo.ladoPaterno ? 'do lado paterno' : 'do lado materno'}`,
                tipoCancer: tipoCancer,
                idadeDiagnostico: parseInt(idade)
              });
            });
          }
        });
      }

      // Adicionar outros familiares
      if (data.outroFamiliarList && data.outroFamiliarList.length > 0) {
        data.outroFamiliarList.forEach(familiar => {
          if (familiar.teveCancer) {
            const historico = formatarHistoricoCancer(familiar);
            historico.forEach(h => {
              const [tipoCancer, idade] = h.split(' aos ');
              relatorio.familiares.push({
                grau: `${familiar.qualFamiliar} ${familiar.ladoPaterno ? 'do lado paterno' : 'do lado materno'}`,
                tipoCancer: tipoCancer,
                idadeDiagnostico: parseInt(idade)
              });
            });
          }
        });
      }

      // Verificar se há familiares com câncer
      relatorio.temFamiliaresComCancer = relatorio.familiares.length > 0;

      // Log: Preview of PDF content
     // console.log("Prévia do conteúdo do PDF:", relatorio);

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
      //console.error(`Erro ao baixar o relatório: ${error}`);
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
                  <button
                    className="btn-relatorio"
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
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            Primeira
          </button>
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
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            Última
          </button>
        </div>
      </div>
    </div>
  );
}
