import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./PacienteModal.css";
import DadosPaciente from "../DadosPaciente/DadosPaciente";
import FilhosFilhas from "../FilhosFilhas/FilhosFilhas";
import NetosNetas from "../NetosNetas/NetosNetas";
import IrmaosIrmas from "../IrmaosIrmas/IrmaosIrmas";
import SobrinhosSobrinhas from "../SobrinhoSobrinha/SobrinhoSobrinha";
import DadosFamiliaMaterna from "../DadosFamiliaMaterna/DadosFamiliaMaterna";
import AvosMaternos from "../AvosMaternos/AvosMaternos";
import PrimosPrimasMaternos from "../PrimosPrimasMaternas/PrimosPrimasMaternos";
import FamiliaresDistantesMaterno from "../FamiliaresDistantesMaterno/FamiliaresDistantesMaterno";
import DadosFamiliaPaterna from "../DadosFamiliaPaterna/DadosFamiliaPaterna";
import AvosPaternos from "../AvosPaternos/AvosPaternos";
import PrimosPrimasPaternos from "../PrimosPrimasPaternas/PrimosPrimasPaternos";
import FamiliaresDistantesPaterno from "../FamiliaresDistantesPaterno/FamiliaresDistantesPaterno";

export default function PacienteModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef(null);

  const steps = [
    {
      id: 0,
      label: "Etapa 1",
      subSteps: [
        { id: 0, label: "Dados do paciente", component: <DadosPaciente /> },
        { id: 1, label: "Filhos e filhas", component: <FilhosFilhas /> },
        { id: 2, label: "Netos e netas", component: <NetosNetas /> },
        { id: 3, label: "Irmãos e irmãs", component: <IrmaosIrmas /> },
        { id: 4, label: "Sobrinhos e sobrinhas", component: <SobrinhosSobrinhas /> },
      ],
    },
    {
      id: 1,
      label: "Etapa 2",
      subSteps: [
        { id: 0, label: "Dados da família materna", component: <DadosFamiliaMaterna /> },
        { id: 1, label: "Avós", component: <AvosMaternos /> },
        { id: 2, label: "Primos e primas", component: <PrimosPrimasMaternos /> },
        { id: 3, label: "Familiares distantes", component: <FamiliaresDistantesMaterno /> },
      ],
    },
    {
      id: 2,
      label: "Etapa 3",
      subSteps: [
        { id: 0, label: "Dados da família paterna", component: <DadosFamiliaPaterna /> },
        { id: 1, label: "Avós", component: <AvosPaternos /> },
        { id: 2, label: "Primos e primas", component: <PrimosPrimasPaternos /> },
        { id: 3, label: "Familiares distantes", component: <FamiliaresDistantesPaterno /> },
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
                <li
                  key={step.id}
                  className={step.id === currentStep ? "active" : ""}
                  onClick={() => setCurrentStep(step.id)}
                >
                  {step.label}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Modal Content */}
          <div className="pacienteModal__form">
            {/* Render only the current subStep's component */}
            {steps[currentStep].subSteps.map((subStep) => (
              currentStep === steps[currentStep].id && (
                <div key={subStep.id}>{subStep.component}</div> // Adiciona a chave única
              )
            ))}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pacienteModal__footer">
          <button onClick={handleBack} disabled={currentStep === 0}>
            Voltar
          </button>
          <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}

PacienteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
