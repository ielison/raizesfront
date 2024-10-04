import { useState } from 'react';
import DadosPaciente from './DadosPaciente';
import Register1 from './Register1';
import Register2 from './Register2';

export default function ModalController() {
  const [currentModal, setCurrentModal] = useState("register1"); // Start with Register1
  const [formData, setFormData] = useState({});

  const handleModalClose = (nextModal = null) => {
    if (nextModal) {
      setCurrentModal(nextModal);
    } else {
      setCurrentModal(null); // Close modal
    }
  };

  const renderModal = () => {
    switch (currentModal) {
      case "register1":
        return (
          <Register1
            onClose={() => handleModalClose()}
            onAdvance={() => handleModalClose("register2")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "register2":
        return (
          <Register2
            onClose={() => handleModalClose()}
            onBack={() => handleModalClose("register1")}
            onAdvance={() => handleModalClose("dadosPaciente")}
            formData={formData}
          />
        );
      case "dadosPaciente":
        return (
          <DadosPaciente
            onClose={() => handleModalClose()}
            onAdvance={() => handleModalClose("anotherStep")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderModal()}
    </div>
  );
}
