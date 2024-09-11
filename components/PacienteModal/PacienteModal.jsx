import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "./PacienteModal.css";
import DadosPaciente2 from "../DadosPaciente2/DadosPaciente2";
import FilhosFilhas2 from "../FilhosFilhas2/FilhosFilhas2";
import NetosNetas from "../NetosNetas2/NetosNetas2";

export default function PacienteModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubItem, setCurrentSubItem] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const modalRef = useRef(null);

  const steps = useMemo(() => [
    {
      id: 0,
      label: "Etapa 1",
      subItems: [
        { id: 0, label: "Dados do paciente", component: <SubItem1 /> },
        { id: 1, label: "Filhos e filhas", component: <SubItem2 /> },
        { id: 2, label: "Netos e netas", component: <SubItem3 /> },
        { id: 3, label: "Irmãos e irmãs", component: <SubItem4 /> },
        { id: 4, label: "Sobrinhos e sobrinhas", component: <SubItem5 /> },
      ],
    },
    {
      id: 1,
      label: "Etapa 2",
      subItems: [
        { id: 0, label: "Dados da família materna", component: <SubItem6 /> },
        { id: 1, label: "Avós", component: <SubItem7 /> },
        { id: 2, label: "Primos e primas", component: <SubItem8 /> },
        { id: 3, label: "Familiares distantes", component: <SubItem9 /> },
      ],
    },
    {
      id: 2,
      label: "Etapa 3",
      subItems: [
        { id: 0, label: "Dados da família paterna", component: <SubItem10 /> },
        { id: 1, label: "Avós", component: <SubItem11 /> },
        { id: 2, label: "Primos e primas", component: <SubItem12 /> },
        { id: 3, label: "Familiares distantes", component: <SubItem13 /> },
      ],
    },
  ], []); // Dependências vazias para garantir que 'steps' não mude

  const handleNext = () => {
    // Verifica se ainda há subitens na etapa atual
    if (currentSubItem < steps[currentStep].subItems.length - 1) {
      setCurrentSubItem(currentSubItem + 1);
    } else if (currentStep < steps.length - 1) {
      // Se estiver na última subetapa, vai para a próxima etapa
      setCurrentStep(currentStep + 1);
      setCurrentSubItem(0); // Reseta para o primeiro subitem ao mudar de etapa
    }
  };

  const handleBack = () => {
    if (currentSubItem > 0) {
      setCurrentSubItem(currentSubItem - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentSubItem(steps[currentStep - 1].subItems.length - 1); // Ir para o último subitem da etapa anterior
    }
  };

  const handleStepClick = (stepId) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId)); // Toggle the expanded state

    if (expandedStep !== stepId) {
      setCurrentStep(stepId); // Set the current step to the clicked step
      setCurrentSubItem(0); // Reset subitem to 0 when changing steps
    }
  };

  const handleSubItemClick = (subItemId) => {
    setCurrentSubItem(subItemId); // Set the current subitem when clicking
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
    console.log(`Etapa atual: ${steps[currentStep].label}, Subitem atual: ${steps[currentStep].subItems[currentSubItem].label}`);
  }, [currentStep, currentSubItem, steps]); // 'steps' agora não mudará em cada render

  return (
    <div className="pacienteModal__overlay">
      <div className="pacienteModal__container" ref={modalRef}>
        {/* Close Button */}
        <button className="pacienteModal__close" onClick={onClose}>
          &times;
        </button>

        <div className="pacienteModal__content">
          {/* Left Navigation Bar */}
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
                      ▼
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
                          onClick={() => handleSubItemClick(subItem.id)} // Update the subitem click handler
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

          {/* Right Modal Content */}
          <div className="pacienteModal__form">
            {steps[currentStep].subItems[currentSubItem].component}

            {/* Bottom Navigation Buttons */}
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
                  (currentStep === 0 &&
                    currentSubItem === steps[currentStep].subItems.length - 1) ||
                  (currentStep === 1 &&
                    currentSubItem === steps[currentStep].subItems.length - 1) ||
                  (currentStep === 2 &&
                    currentSubItem === steps[currentStep].subItems.length - 1)
                }
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubItem1() {
  return (
    <div>
      <div>Etapa 1 - Dados do paciente</div>
      <DadosPaciente2 />
    </div>
  );
}

function SubItem2() {
  return (
    <div>
      <div>Etapa 1 - Filhos e filhas</div>
      <FilhosFilhas2 />
    </div>
  )
}

function SubItem3() {
  return (
    <div>
      <div>Etapa 1 - Netos e netas</div>
      <NetosNetas />
    </div>
  ) 
}

function SubItem4() {
  return <div>Etapa 1 - Irmãos e irmãs</div>;
}

function SubItem5() {
  return <div>Etapa 1 - Sobrinhos e sobrinhas</div>;
}

function SubItem6() {
  return <div>Etapa 2 - Dados da família materna</div>;
}

function SubItem7() {
  return <div>Etapa 2 - Avós</div>;
}

function SubItem8() {
  return <div>Etapa 2 - Primos e primas</div>;
}

function SubItem9() {
  return <div>Etapa 2 - Familiares distantes</div>;
}

function SubItem10() {
  return <div>Etapa 3 - Dados da família paterna</div>;
}

function SubItem11() {
  return <div>Etapa 3 - Avós</div>;
}

function SubItem12() {
  return <div>Etapa 3 - Primos e primas</div>;
}

function SubItem13() {
  return <div>Etapa 3 - Familiares distantes</div>;
}

PacienteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
