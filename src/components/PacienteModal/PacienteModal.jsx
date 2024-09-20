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
import FamiliaresDistantesPaterno2 from "../FamiliaresDistantesPaterno copy/FamiliaresDistantesPaterno2";

import { useAuth } from "../../context/AuthContext";

export default function PacienteModal({ onClose }) {
  const { idUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubItem, setCurrentSubItem] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const modalRef = useRef(null);

  const [data, setData] = useState({
    idUser: idUser,
    idQuiz: 0,
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
    tiosList: [
      {
        id: 0,
        temTios: false,
        qtdTios: 0,
        teveCancer: false,
        qtdTiosCancer: 0,
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
    avosList: [
      {
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
    ],
    primosList: [
      {
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
    ],
    outroFamiliarList: [
      {
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
    ],
  });

  const handleFormChange = (updatedFields) => {
    console.log("Updating Form Fields:", updatedFields);
  
    const { usuariPrincipal, mae, pai, filhosList, netosList, irmaosList, sobrinhosList, tiosListMaterno, tiosListPaterno, avosList, primosList, outroFamiliarList } = updatedFields;
  
    // Função para mesclar e filtrar tios
    const mergeTios = (materno, paterno) => {
      const allTios = [...materno, ...paterno];
      
      // Cria um mapa para garantir que apenas a última atualização é mantida
      const tiosMap = new Map();
      allTios.forEach(tio => {
        tiosMap.set(tio.id, tio); // `id` deve ser uma propriedade única
      });
      
      return Array.from(tiosMap.values());
    };
  
    setData((prevData) => ({
      ...prevData,
      usuariPrincipal: {
        ...prevData.usuariPrincipal,
        ...usuariPrincipal,
      },
      mae: {
        ...prevData.mae,
        ...mae,
      },
      pai: {
        ...prevData.pai,
        ...pai,
      },
      filhosList: filhosList ? filhosList : prevData.filhosList,
      netosList: netosList ? netosList : prevData.netosList,
      irmaosList: irmaosList ? irmaosList : prevData.irmaosList,
      sobrinhosList: sobrinhosList ? sobrinhosList : prevData.sobrinhosList,
      tiosList: mergeTios(tiosListMaterno || [], tiosListPaterno || []), // Mescla as listas de tios
      avosList: avosList ? avosList : prevData.avosList,
      primosList: primosList ? primosList : prevData.primosList,
      outroFamiliarList: outroFamiliarList ? outroFamiliarList : prevData.outroFamiliarList,
    }));
  };
  

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
          { id: 1, label: "Filhos e filhas", component: <SubItem2  onFormChange={handleFormChange}  /> },
          { id: 2, label: "Netos e netas", component: <SubItem3 onFormChange={handleFormChange}  />  },
          { id: 3, label: "Irmãos e irmãs", component: <SubItem4 onFormChange={handleFormChange}  /> },
          { id: 4, label: "Sobrinhos e sobrinhas", component: <SubItem5 onFormChange={handleFormChange} /> },
        ],
      },
      {
        id: 1,
        label: "Etapa 2",
        subItems: [
          { id: 0, label: "Dados da família materna", component: <SubItem6 onFormChange={handleFormChange} /> },
          { id: 1, label: "Avós", component: <SubItem7 onFormChange={handleFormChange} /> },
          { id: 2, label: "Primos e primas", component: <SubItem8 onFormChange={handleFormChange} /> },
          { id: 3, label: "Familiares distantes", component: <SubItem9 onFormChange={handleFormChange} /> },
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
          { id: 1, label: "Avós", component: <SubItem11 onFormChange={handleFormChange} /> },
          { id: 2, label: "Primos e primas", component: <SubItem12 onFormChange={handleFormChange} /> },
          { id: 3, label: "Familiares distantes", component: <SubItem13 onFormChange={handleFormChange} /> },
        ],
      },
    ],
    []
  );

  const handleNext = () => {
    console.log(`Step: ${currentStep}, Subitem: ${currentSubItem}`); // Debug log

    const currentDate = new Date().toISOString();

    // Cria uma cópia do estado atual com a dataConsulta atualizada
    const updatedData = {
      ...data,
      usuariPrincipal: {
        ...data.usuariPrincipal,
        dataConsulta: currentDate,
        qualCancer: data.usuariPrincipal.qualCancer || "",
      },
    };

    // Atualiza o estado para garantir que `data` está sincronizado
    setData(updatedData);

    if (currentStep === 2 && currentSubItem === 3) {
      console.log(
        "Último subitem da Etapa 3. Preparando para a animação de carregamento."
      ); // Log for last subitem

      console.log("Payload to be sent:", JSON.stringify(updatedData, null, 2));

      setIsLoading(true);
      setExpandedStep(null);
      // Send data to API
      fetch("http://your-api-endpoint.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Envia a cópia com a data atualizada
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((result) => {
          console.log("Data successfully sent:", result);
          setIsCompleted(true);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        })
        .finally(() => {
          setIsLoading(false);
          onClose(); // Close the modal after completing
          console.log("Cadastro finalizado, aguarde"); // Log for completed registration
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    console.log(`Step: ${currentStep}, Subitem: ${currentSubItem}`);
  }, [currentStep, currentSubItem]);

  return (
    <div className="pacienteModal__overlay">
      <div className="pacienteModal__container" ref={modalRef}>
        <button className="pacienteModal__close" onClick={onClose}>
          &times;
        </button>

        <div className="pacienteModal__content">
          {isCompleted ? (
            <div className="completion-message">
              <h2>Questionário finalizado!</h2>
              <p>Com base nas respostas obtidas pudemos gerar um relatório.</p>
              <button onClick={onClose}>Abrir relatório</button>
            </div>
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
                                subItem.id === currentSubItem ? "active" : ""
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
  );
}

function SubItem1({ onFormChange }) {
  return (
    <div>
      <div>Etapa 1 - Dados do paciente</div>
      <DadosPaciente2 onFormChange={onFormChange} />
    </div>
  );
}

function SubItem2({ onFormChange }) {
  return (
    <div>
      <div>Etapa 1 - Filhos e filhas</div>
      <FilhosFilhas2 onFormChange={onFormChange}/>
    </div>
  );
}

function SubItem3({ onFormChange }) {
  return (
    <div>
      <div>Etapa 1 - Netos e netas</div>
      <NetosNetas2 onFormChange={onFormChange}/>
    </div>
  );
}

function SubItem4({ onFormChange }) {
  return (
    <>
      <div>Etapa 1 - Irmãos e irmãs</div>
      <IrmaosIrmas2 onFormChange={onFormChange}/>
    </>
  );
}

function SubItem5({ onFormChange }) {
  return (
    <div>
      <div>Etapa 1 - Sobrinhos e sobrinhas</div>
      <SobrinhoSobrinha2  onFormChange={onFormChange}/>
    </div>
  );
}

function SubItem6({ onFormChange }) {
  return (
    <div>
      <div>Etapa 2 - Dados da família materna</div>
      <DadosFamiliaMaterna2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem7({ onFormChange }) {
  return (
    <div>
      <div>Etapa 2 - Avós maternos</div>
      <AvosMaternos2  onFormChange={onFormChange}/>
    </div>
  );
}

function SubItem8({ onFormChange }) {
  return (
    <div>
      <div>Etapa 2 - Primos e primas</div>
      <PrimosPrimasMaternos2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem9({ onFormChange }) {
  return (
    <div>
      <div>Etapa 2 - Familiares distantes</div>
      <FamiliaresDistantesMaterno2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem10({ onFormChange  }) {
  return (
    <div>
      <div>Etapa 3 - Dados da família paterna</div>
      <DadosFamiliaPaterna2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem11({ onFormChange }) {
  return (
    <div>
      <div>Etapa 3 - Avós paternos</div>
      <AvosPaternos2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem12({ onFormChange }) {
  return (
    <div>
      <div>Etapa 3 - Primos e primas</div>
      <PrimosPrimasPaternos2  onFormChange={onFormChange} />
    </div>
  );
}

function SubItem13({ onFormChange }) {
  return (
    <div>
      <div>Etapa 3 - Familiares distantes</div>
      <FamiliaresDistantesPaterno2  onFormChange={onFormChange} />
    </div>
  );
}

PacienteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  idUser: PropTypes.number.isRequired,
};

SubItem1.propTypes, SubItem2.propTypes, SubItem3.propTypes, SubItem4.propTypes, SubItem5.propTypes, SubItem6.propTypes, SubItem7.propTypes, SubItem8.propTypes, SubItem9.propTypes, SubItem10.propTypes, SubItem11.propTypes, SubItem12.propTypes, SubItem13.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
