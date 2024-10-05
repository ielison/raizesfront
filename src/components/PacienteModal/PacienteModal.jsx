import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "./PacienteModal.css";
import DadosPaciente2 from "../DadosPaciente2/DadosPaciente2";
import FilhosFilhas2 from "../FilhosFilhas2/FilhosFilhas2";
import NetosNetas2 from "../NetosNetas2/NetosNetas2";
import IrmaosIrmas2 from "../IrmaosIrmas2/IrmaosIrmas2";
import SobrinhoSobrinha2 from "../SobrinhoSobrinha2/SobrinhoSobrinha2";
import DadosFamiliaMaterna2 from "../DadosFamiliaMaterna2/DadosFamiliaMaterna2";
import AvosMaternos2 from "../AvosMaternos2/AvosMaternos2";
import PrimosPrimasPaternos2 from "../PrimosPrimasPaternas2/PrimosPrimasPaternos2";
import PrimosPrimasMaternos2 from "../PrimosPrimasMaternas2/PrimosPrimasMaternos2";
import FamiliaresDistantesMaterno2 from "../FamiliaresDistantesMaterno2/FamiliaresDistantesMaterno2";
import AvosPaternos2 from "../AvosPaternos2/AvosPaternos2";
import DadosFamiliaPaterna2 from "../DadosFamiliaPaterna2/DadosFamiliaPaterna2";
import FamiliaresDistantesPaterno2 from "../FamiliaresDistantesPaterno2/FamiliaresDistantesPaterno2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../../context/AuthContext";

export default function PacienteModal({ onClose }) {
  const { idUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubItem, setCurrentSubItem] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestionarioFinalizado2, setShowQuestionarioFinalizado2] =
    useState(false);
  const [isHighRisk, setIsHighRisk] = useState(false);
  const modalRef = useRef(null);

  const [data, setData] = useState({
    idUser: idUser,
    idQuiz: 1,
    usuariPrincipal: {
      quizId: 0,
      teveCancer: false,
      qualCancer: "",
      idadeDiagnostico: 0,
      outroCancer: false,
      sexo: "",
      nome: "",
      idade: 0,
      telefone: "",
      dataConsulta: "",
      outroCancerList: [
        {
          idCancer: 0,
          tipoCancer: "",
          idadeDiagnostico: 0,
        },
      ],
    },
    mae: {
      id: 0,
      teveCancer: false,
      outroCancerList: [
        {
          id: 0,
          idadeDiagnostico: 0,
          tipoCancer: "",
        },
      ],
    },
    pai: {
      id: 0,
      teveCancer: false,
      outroCancerList: [
        {
          id: 0,
          idadeDiagnostico: 0,
          tipoCancer: "",
        },
      ],
    },
    filhosList: [
      {
        id: 0,
        temFilhos: false,
        qtdFilhos: 0,
        teveCancer: false,
        qtdFilhosCancer: 0,
        sexo: "",
        mesmoPais: false,
        outroCancerList: [
          {
            id: 0,
            idadeDiagnostico: 0,
            tipoCancer: "",
          },
        ],
      },
    ],
    netosList: [
      {
        id: 0,
        temNeto: false,
        qtdNetos: 0,
        teveCancer: false,
        qtdNetosCancer: 0,
        sexo: "",
        outroCancerList: [
          {
            id: 0,
            idadeDiagnostico: 0,
            tipoCancer: "",
          },
        ],
      },
    ],
    irmaosList: [
      {
        id: 0,
        temIrmao: false,
        qtdIrmao: 0,
        teveCancer: false,
        qtdeIrmaosCancer: 0,
        mesmosPais: false,
        sexo: "",
        outroCancerList: [
          {
            id: 0,
            idadeDiagnostico: 0,
            tipoCancer: "",
          },
        ],
      },
    ],
    sobrinhosList: [
      {
        id: 0,
        temSobrinhos: false,
        qtdSobrinhos: 0,
        teveCancer: false,
        qtdSobrinhosCancer: 0,
        meioSobrinho: false,
        sexo: "",
        outroCancerList: [
          {
            id: 0,
            idadeDiagnostico: 0,
            tipoCancer: "",
          },
        ],
      },
    ],
    tiosListMaterno: [],
    tiosListPaterno: [],
    avosListMaterno: [],
    avosListPaterno: [],
    primosListMaterno: [],
    primosListPaterno: [],
    outroFamiliarListMaterno: [],
    outroFamiliarListPaterno: [],
  });

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(data));
  }, [data]);

  const handleModalClose = () => {
    localStorage.setItem("formData", JSON.stringify(data));
    onClose();
  };

  const mergeLists = (list1, list2) => {
    return [...list1, ...list2];
  };

  const handleFormChange = (updatedFields) => {
    console.log("Updating Form Fields:", updatedFields);

    setData((prevData) => ({
      ...prevData,
      ...updatedFields,
    }));
  };

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(data));
    return () => {
      //localStorage.removeItem('formData'); // Clear on unmount
    };
  }, [data]);

  const steps = useMemo(
    () => [
      {
        id: 0,
        label: "Etapa 1",
        subItems: [
          {
            id: 0,
            label: "Dados do paciente",
            component: <SubItem1 onFormChange={handleFormChange} />,
          },
          {
            id: 1,
            label: "Filhos e filhas",
            component: <SubItem2 onFormChange={handleFormChange} />,
          },
          {
            id: 2,
            label: "Netos e netas",
            component: <SubItem3 onFormChange={handleFormChange} />,
          },
          {
            id: 3,
            label: "Irmãos e irmãs",
            component: <SubItem4 onFormChange={handleFormChange} />,
          },
          {
            id: 4,
            label: "Sobrinhos e sobrinhas",
            component: <SubItem5 onFormChange={handleFormChange} />,
          },
        ],
      },
      {
        id: 1,
        label: "Etapa 2",
        subItems: [
          {
            id: 0,
            label: "Dados da família materna",
            component: <SubItem6 onFormChange={handleFormChange} />,
          },
          {
            id: 1,
            label: "Avós",
            component: <SubItem7 onFormChange={handleFormChange} />,
          },
          {
            id: 2,
            label: "Primos e primas",
            component: <SubItem8 onFormChange={handleFormChange} />,
          },
          {
            id: 3,
            label: "Familiares distantes",
            component: <SubItem9 onFormChange={handleFormChange} />,
          },
        ],
      },
      {
        id: 2,
        label: "Etapa 3",
        subItems: [
          {
            id: 0,
            label: "Dados da família paterna",
            component: <SubItem10 onFormChange={handleFormChange} />,
          },
          {
            id: 1,
            label: "Avós",
            component: <SubItem11 onFormChange={handleFormChange} />,
          },
          {
            id: 2,
            label: "Primos e primas",
            component: <SubItem12 onFormChange={handleFormChange} />,
          },
          {
            id: 3,
            label: "Familiares distantes",
            component: <SubItem13 onFormChange={handleFormChange} />,
          },
        ],
      },
    ],
    []
  );

  const ensureLowerCase = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (key === "sexo" || key === "ladoPaterno") {
          return [key, typeof value === "string" ? value.toLowerCase() : value];
        }
        if (Array.isArray(value)) {
          return [key, value.map(ensureLowerCase)];
        }
        if (typeof value === "object") {
          return [key, ensureLowerCase(value)];
        }
        return [key, value];
      })
    );
  };

  /* const collectLocalStorageData = () => {
    const localStorageData = {
      dadosPaciente: JSON.parse(localStorage.getItem("dp2_userData") || "{}"),
      filhosFilhas: JSON.parse(
        localStorage.getItem("ff2_filhosDetails") || "[]"
      ),
      netosNetas: JSON.parse(localStorage.getItem("nn2_netosDetails") || "[]"),
      irmaosIrmas: JSON.parse(
        localStorage.getItem("ii2_irmaosDetails") || "[]"
      ),
      sobrinhosSobrinhas: JSON.parse(
        localStorage.getItem("ss2_sobrinhosDetails") || "[]"
      ),
      dadosFamiliaMaterna: {
        noKnowledge: JSON.parse(
          localStorage.getItem("dfm2_noKnowledge") || "false"
        ),
        motherHadCancer: JSON.parse(
          localStorage.getItem("dfm2_motherHadCancer") || "false"
        ),
        motherCancerDetails: JSON.parse(
          localStorage.getItem("dfm2_motherCancerDetails") || "[]"
        ),
        hasMaternalUnclesAunts: JSON.parse(
          localStorage.getItem("dfm2_hasMaternalUnclesAunts") || "false"
        ),
        uncleAuntQuantities: JSON.parse(
          localStorage.getItem("dfm2_uncleAuntQuantities") || "{}"
        ),
        uncleAuntCancer: JSON.parse(
          localStorage.getItem("dfm2_uncleAuntCancer") || "false"
        ),
        uncleAuntCancerDetails: JSON.parse(
          localStorage.getItem("dfm2_uncleAuntCancerDetails") || "[]"
        ),
      },
      avosMaternos: {
        noKnowledge: JSON.parse(
          localStorage.getItem("am2_noKnowledge") || "false"
        ),
        grandmotherHadCancer: JSON.parse(
          localStorage.getItem("am2_grandmotherHadCancer") || "false"
        ),
        grandfatherHadCancer: JSON.parse(
          localStorage.getItem("am2_grandfatherHadCancer") || "false"
        ),
        grandmotherCancerDetails: JSON.parse(
          localStorage.getItem("am2_grandmotherCancerDetails") || "[]"
        ),
        grandfatherCancerDetails: JSON.parse(
          localStorage.getItem("am2_grandfatherCancerDetails") || "[]"
        ),
      },
      primosPrimasMaternos: {
        primosHadCancer: JSON.parse(
          localStorage.getItem("ppm2_primosHadCancer") || "null"
        ),
        primosDetails: JSON.parse(
          localStorage.getItem("ppm2_primosDetails") || "[]"
        ),
      },
      familiaresDistantesMaternos: {
        distantesHadCancer: JSON.parse(
          localStorage.getItem("fdm2_distantesHadCancer") || "null"
        ),
        distantesDetails: JSON.parse(
          localStorage.getItem("fdm2_distantesDetails") || "[]"
        ),
      },
      dadosFamiliaPaterna: {
        noKnowledge: JSON.parse(
          localStorage.getItem("dfp2_noKnowledge") || "false"
        ),
        fatherHadCancer: JSON.parse(
          localStorage.getItem("dfp2_fatherHadCancer") || "false"
        ),
        fatherCancerDetails: JSON.parse(
          localStorage.getItem("dfp2_fatherCancerDetails") || "[]"
        ),
        hasPaternalUnclesAunts: JSON.parse(
          localStorage.getItem("dfp2_hasPaternalUnclesAunts") || "false"
        ),
        uncleAuntQuantities: JSON.parse(
          localStorage.getItem("dfp2_uncleAuntQuantities") || "{}"
        ),
        uncleAuntCancer: JSON.parse(
          localStorage.getItem("dfp2_uncleAuntCancer") || "false"
        ),
        uncleAuntCancerDetails: JSON.parse(
          localStorage.getItem("dfp2_uncleAuntCancerDetails") || "[]"
        ),
      },
      avosPaternos: {
        noKnowledge: JSON.parse(
          localStorage.getItem("ap2_noKnowledge") || "false"
        ),
        grandmotherHadCancer: JSON.parse(
          localStorage.getItem("ap2_grandmotherHadCancer") || "false"
        ),
        grandfatherHadCancer: JSON.parse(
          localStorage.getItem("ap2_grandfatherHadCancer") || "false"
        ),
        grandmotherCancerDetails: JSON.parse(
          localStorage.getItem("ap2_grandmotherCancerDetails") || "[]"
        ),
        grandfatherCancerDetails: JSON.parse(
          localStorage.getItem("ap2_grandfatherCancerDetails") || "[]"
        ),
      },
      primosPrimasPaternos: {
        primosHadCancer: JSON.parse(
          localStorage.getItem("ppp2_primosHadCancer") || "null"
        ),
        primosDetails: JSON.parse(
          localStorage.getItem("ppp2_primosDetails") || "[]"
        ),
      },
      familiaresDistantesPaternos: {
        distantesHadCancer: JSON.parse(
          localStorage.getItem("fdp2_distantesHadCancer") || "null"
        ),
        distantesDetails: JSON.parse(
          localStorage.getItem("fdp2_distantesDetails") || "[]"
        ),
      },
    };
    return localStorageData;
  }; */

  const clearAllStorageData = () => {
    // Clear all localStorage items
    localStorage.clear();

    // Clear all sessionStorage items
    sessionStorage.clear();

    console.log("All localStorage and sessionStorage data has been cleared.");
  };

  const handleNext = () => {
    console.log(`Step: ${currentStep}, Subitem: ${currentSubItem}`);

    const currentDate = new Date().toISOString();

    if (currentStep === 2 && currentSubItem === 3) {
      setIsLoading(true);
      setExpandedStep(null);

      const mergedTios = mergeLists(data.tiosListMaterno, data.tiosListPaterno);
      const mergedAvos = mergeLists(data.avosListMaterno, data.avosListPaterno);
      const mergedPrimos = mergeLists(
        data.primosListMaterno,
        data.primosListPaterno
      );
      const mergedOutroFamiliar = mergeLists(
        data.outroFamiliarListMaterno,
        data.outroFamiliarListPaterno
      );

      const payloadData = ensureLowerCase({
        ...data,
        usuariPrincipal: {
          ...data.usuariPrincipal,
          dataConsulta: currentDate,
          qualCancer: data.usuariPrincipal.qualCancer || "",
        },
        tiosList: mergedTios,
        avosList: mergedAvos,
        primosList: mergedPrimos,
        outroFamiliarList: mergedOutroFamiliar,
      });

      // Remove the separate lists from the payload
      delete payloadData.tiosListMaterno;
      delete payloadData.tiosListPaterno;
      delete payloadData.avosListMaterno;
      delete payloadData.avosListPaterno;
      delete payloadData.primosListMaterno;
      delete payloadData.primosListPaterno;
      delete payloadData.outroFamiliarListMaterno;
      delete payloadData.outroFamiliarListPaterno;

      console.log(
        "Payload to be sent to /quiz:",
        JSON.stringify(payloadData, null, 2)
      );

      // Send data to /quiz
      fetch("https://testserver-2p40.onrender.com/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      })
        .then((response) => {
          console.log("Response status from /quiz:", response.status);
          if (response.ok) {
            console.log("Resposta OK da API /quiz.");
            return "OK";
          } else {
            throw new Error(
              "Erro ao enviar os dados para /quiz: " + response.statusText
            );
          }
        })
        .then((message) => {
          console.log("Resposta da API /quiz:", message);
          setIsCompleted(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro:", error);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
          localStorage.removeItem("formData");
          // Clear all localStorage items
          Object.keys(localStorage).forEach((key) => {
            if (
              key.startsWith("dp2_") ||
              key.startsWith("ff2_") ||
              key.startsWith("nn2_") ||
              key.startsWith("ii2_") ||
              key.startsWith("ss2_") ||
              key.startsWith("dfm2_") ||
              key.startsWith("am2_") ||
              key.startsWith("ppm2_") ||
              key.startsWith("fdm2_") ||
              key.startsWith("dfp2_") ||
              key.startsWith("ap2_") ||
              key.startsWith("ppp2_") ||
              key.startsWith("fdp2_")
            ) {
              localStorage.removeItem(key);
            }
          });
          clearAllStorageData();
          console.log("Cadastro finalizado, aguarde");
        });
    } else {
      if (currentSubItem < steps[currentStep].subItems.length - 1) {
        setCurrentSubItem(currentSubItem + 1);
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentSubItem(0);
        setExpandedStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentSubItem > 0) {
      setCurrentSubItem(currentSubItem - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentSubItem(steps[currentStep - 1].subItems.length - 1);
      setExpandedStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  const handleSubItemClick = (stepId, subItemId) => {
    setCurrentStep(stepId);
    setCurrentSubItem(subItemId);
  };

  const handleAdvanceToQuestionarioFinalizado2 = async () => {
    try {
      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/getPacientes/${idUser}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
      const data = await response.json();

      console.log("API Response:", data); // Log the entire API response

      if (!Array.isArray(data) || data.length === 0) {
        console.error("No quiz data found for this user");
        return;
      }

      // Get the last item of the array
      const latestEntry = data[data.length - 1];

      console.log("Latest Entry:", latestEntry); // Log the latest entry
      console.log("ID do Quiz:", latestEntry.idQuestionario); // Log do ID do quiz
      console.log("Resultado (risco):", latestEntry.risco); // Log do valor de "resultado" (risco)

      setIsHighRisk(latestEntry.risco === true);
      setShowQuestionarioFinalizado2(true);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handleDownloadReport = async () => {
    console.log("Iniciando download do relatório...");
    toast.success("O download foi iniciado e terminará em poucos instantes!");
  
    try {
      // Fetch the latest quiz data
      const response = await fetch(
        `https://testserver-2p40.onrender.com/api/quiz/getPacientes/${idUser}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch patient data: ${response.status}`);
      }
      const data = await response.json();
  
      console.log("API Response:", data); // Log the entire API response
  
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No quiz data found for this user");
      }
  
      // Get the last item of the array
      const latestEntry = data[data.length - 1];
  
      console.log("Latest Entry:", latestEntry); // Log the latest entry
      console.log("ID do Quiz:", latestEntry.idQuestionario); // Log do ID do quiz
      console.log("Resultado (risco):", latestEntry.risco); // Log do valor de "resultado" (risco)
  
      const pacienteId = latestEntry.idQuestionario; // Use idQuestionario instead of id
  
      // Chamada para obter o resultado do quiz
      const resultadoUrl = `https://testserver-2p40.onrender.com/api/quiz/resultado/${pacienteId}/${idUser}`;
      console.log("Fetching quiz result from:", resultadoUrl);
      const resultadoResponse = await fetch(resultadoUrl);
  
      if (!resultadoResponse.ok) {
        throw new Error(
          `Erro ao obter resultado do quiz: ${resultadoResponse.status}`
        );
      }
  
      const resultadoData = await resultadoResponse.json();
      console.log("Resultado do quiz:", resultadoData);
      const precisaPesquisaOncogenetica = resultadoData;
  
      // Fetch patient data
      const pacienteUrl = `https://testserver-2p40.onrender.com/api/quiz/${pacienteId}`;
      console.log("Fetching patient data from:", pacienteUrl);
      const pacienteResponse = await fetch(pacienteUrl);
  
      if (!pacienteResponse.ok) {
        throw new Error(`Erro ao baixar relatório: ${pacienteResponse.status}`);
      }
  
      const pacienteData = await pacienteResponse.json();
      console.log("Dados do paciente:", pacienteData);
  
      // Adaptar os dados para o formato desejado
      const relatorio = {
        nome: pacienteData.usuariPrincipal.nome,
        idade: pacienteData.usuariPrincipal.idade,
        historicoPessoal: [],
        familiares: [],
        precisaPesquisaOncogenetica,
      };
  
      // Adicionar histórico pessoal de câncer do usuário principal
      if (pacienteData.usuariPrincipal.teveCancer) {
        relatorio.historicoPessoal.push(
          `${pacienteData.usuariPrincipal.qualCancer} aos ${pacienteData.usuariPrincipal.idadeDiagnostico} anos`
        );
      }
  
      // Adicionar outros tipos de câncer do usuário principal
      if (
        pacienteData.usuariPrincipal.outroCancerList &&
        pacienteData.usuariPrincipal.outroCancerList.length > 0
      ) {
        pacienteData.usuariPrincipal.outroCancerList.forEach((cancer) => {
          relatorio.historicoPessoal.push(
            `${cancer.tipoCancer} aos ${cancer.idadeDiagnostico} anos`
          );
        });
      }
  
      // Se não houver histórico de câncer
      if (relatorio.historicoPessoal.length === 0) {
        relatorio.historicoPessoal.push("Sem histórico pessoal de câncer");
      }
  
      // Adicionar informações dos familiares (exemplo simplificado)
      if (pacienteData.mae && pacienteData.mae.teveCancer) {
        relatorio.familiares.push(`Mãe: ${pacienteData.mae.qualCancer}`);
      }
      if (pacienteData.pai && pacienteData.pai.teveCancer) {
        relatorio.familiares.push(`Pai: ${pacienteData.pai.qualCancer}`);
      }
      // Adicione mais familiares conforme necessário
  
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

  useEffect(() => {
    console.log(`Step: ${currentStep}, Subitem: ${currentSubItem}`);
  }, [currentStep, currentSubItem]);

  return (
    <div>
      <ToastContainer />
      <div className="pacienteModal__overlay">
        <div
          className={`pacienteModal__container ${
            isCompleted ? "pacienteModal__container--completed" : ""
          }`}
          ref={modalRef}
        >
          <button className="pacienteModal__close" onClick={handleModalClose}>
            &times;
          </button>

          <div
            className={`pacienteModal__content ${
              isCompleted ? "pacienteModal__content--completed" : ""
            }`}
          >
            {isCompleted ? (
              showQuestionarioFinalizado2 ? (
                <div className="modal-content-questionario__finalizado2">
                  <div
                    className="alert-icon"
                    style={{ display: isHighRisk ? "block" : "none" }}
                  >
                    ⚠️
                  </div>
                  <h2 className="resultado-h2">
                    {isHighRisk
                      ? "Atenção, pode haver risco!"
                      : "Resultado da Avaliação"}
                  </h2>
                  {isHighRisk ? (
                    <p>
                      Seu paciente atende aos critérios que indicam um alto
                      risco para câncer hereditário. Recomendamos encaminhá-lo a
                      um serviço especializado. Consulte a aba &apos;links
                      úteis&apos; para obter mais informações sobre
                      profissionais e serviços especializados.
                    </p>
                  ) : (
                    <p>
                      Com base na avaliação realizada, observamos que seu
                      paciente não atende aos critérios que indicariam um alto
                      risco para câncer hereditário.
                    </p>
                  )}
                  <p>
                    É importante destacar que muitos casos de câncer estão
                    relacionados ao estilo de vida e a fatores ambientais.
                    Recomendamos enfatizar a importância de hábitos saudáveis,
                    como dieta equilibrada, exercícios físicos regulares,
                    abstenção de tabagismo e consumo moderado de álcool, para
                    ajudar a reduzir o risco de desenvolver câncer.
                  </p>
                  <p>
                    Além disso, é fundamental estar atento a outros fatores de
                    risco, como exposição a agentes carcinogênicos no ambiente
                    de trabalho, histórico pessoal de doenças prévias, idade e
                    outros aspectos relevantes à saúde do paciente.
                  </p>
                  <p>
                    Continue monitorando e incentivando hábitos de vida
                    saudáveis em seus pacientes, pois isso desempenha um papel
                    significativo na prevenção do câncer e na promoção da saúde.
                  </p>
                  <div className="qf2-form-buttons">
                    <button
                      className="btn-download-report"
                      onClick={handleDownloadReport}
                    >
                      Baixar relatório detalhado
                    </button>
                  </div>
                </div>
              ) : (
                <div className="completion-message">
                  <h2>Questionário finalizado!</h2>
                  <p>
                    Com base nas respostas obtidas pudemos gerar um relatório.
                  </p>
                  <button onClick={handleAdvanceToQuestionarioFinalizado2}>
                    Abrir relatório
                  </button>
                </div>
              )
            ) : (
              <>
                <nav className="pacienteModal__nav">
                  <ul>
                    {steps.map((step) => (
                      <li key={step.id} className="step-item">
                        <button
                          onClick={() => handleStepClick(step.id)}
                          className="step-label"
                        >
                          {step.label}
                          <span
                            className={`expand-icon ${
                              expandedStep === step.id ? "expanded" : ""
                            }`}
                          >
                            {expandedStep === step.id ? "▲" : "▼"}
                          </span>
                        </button>
                        {expandedStep === step.id && (
                          <ul className="subitems-list">
                            {step.subItems.map((subItem) => (
                              <li
                                key={subItem.id}
                                className={
                                  subItem.id === currentSubItem
                                    ? "active"
                                    : "itemsub"
                                }
                                onClick={() =>
                                  handleSubItemClick(step.id, subItem.id)
                                }
                              >
                                {subItem.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="pacienteModal__form">
                  {isLoading ? (
                    <div className="loading-message">
                      <p>Estamos salvando os dados do paciente...</p>
                    </div>
                  ) : (
                    steps[currentStep].subItems[currentSubItem].component
                  )}

                  <div className="pacienteModal__footer">
                    <button
                      onClick={handleBack}
                      disabled={currentSubItem === 0 && currentStep === 0}
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        isLoading &
                        (currentStep === steps.length - 1 &&
                          currentSubItem ===
                            steps[currentStep].subItems.length - 1)
                      }
                    >
                      Avançar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubItem1({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 1 - Dados do paciente</div>
      <DadosPaciente2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem2({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 1 - Filhos e filhas</div>
      <FilhosFilhas2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem3({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 1 - Netos e netas</div>
      <NetosNetas2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem4({ onFormChange }) {
  return (
    <>
      <div className="paciente-modal-title">Etapa 1 - Irmãos e irmãs</div>
      <IrmaosIrmas2 onFormChange={onFormChange} />
    </>
  );
}

function SubItem5({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">
        Etapa 1 - Sobrinhos e sobrinhas
      </div>
      <SobrinhoSobrinha2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem6({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">
        Etapa 2 - Dados da família materna
      </div>
      <DadosFamiliaMaterna2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem7({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 2 - Avós maternos</div>
      <AvosMaternos2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem8({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 2 - Primos e primas</div>
      <PrimosPrimasMaternos2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem9({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 2 - Familiares distantes</div>
      <FamiliaresDistantesMaterno2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem10({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">
        Etapa 3 - Dados da família paterna
      </div>
      <DadosFamiliaPaterna2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem11({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 3 - Avós paternos</div>
      <AvosPaternos2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem12({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 3 - Primos e primas</div>
      <PrimosPrimasPaternos2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem13({ onFormChange }) {
  return (
    <div>
      <div className="paciente-modal-title">Etapa 3 - Familiares distantes</div>
      <FamiliaresDistantesPaterno2 onFormChange={onFormChange} />
    </div>
  );
}

PacienteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  idUser: PropTypes.number.isRequired,
};

SubItem1.propTypes,
  SubItem2.propTypes,
  SubItem3.propTypes,
  SubItem4.propTypes,
  SubItem5.propTypes,
  SubItem6.propTypes,
  SubItem7.propTypes,
  SubItem8.propTypes,
  SubItem9.propTypes,
  SubItem10.propTypes,
  SubItem11.propTypes,
  SubItem12.propTypes,
  (SubItem13.propTypes = {
    onFormChange: PropTypes.func.isRequired,
  });
