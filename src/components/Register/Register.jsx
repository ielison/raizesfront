import { useState } from 'react';
import PropTypes from "prop-types";
import Register1 from './Register1';
import Register2 from './Register2';

const Register = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({}); // Estado para armazenar os dados do formulário

  const goToNextStep = (data) => {
    setFormData(data); // Armazena os dados do formulário
    setCurrentStep(2); // Avança para o próximo passo
  };

  const handleFinish = () => {
    //console.log("Registro concluído com os dados:", formData);
    onClose(); // Fecha o modal após finalizar o registro
  };

  return (
    <div className="modal">
      <Register1
        isOpen={currentStep === 1}
        onClose={onClose}
        onNext={goToNextStep}
      />
      <Register2
        isOpen={currentStep === 2}
        onClose={() => setCurrentStep(1)} // Retorna ao passo anterior
        formData={formData}
        onFinish={handleFinish}
      />
    </div>
  );
};

Register.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Register;
