// PacientesContext.jsx
import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const PacientesContext = createContext();

export function PacientesProvider({ children }) {
  const [pacientes, setPacientes] = useState([]);

  const adicionarPaciente = (novoPaciente) => {
    setPacientes((prevPacientes) => [...prevPacientes, novoPaciente]);
  };

  const atualizarListaPacientes = () => {
    // Aqui você faria uma chamada à API para buscar a lista atualizada de pacientes
    // Por enquanto, vamos simular com um paciente de exemplo
    const pacienteExemplo = {
      id: Date.now(),
      nome: "Novo Paciente",
      // ... outros dados do paciente
    };
    adicionarPaciente(pacienteExemplo);
  };

  return (
    <PacientesContext.Provider value={{ pacientes, adicionarPaciente, atualizarListaPacientes }}>
      {children}
    </PacientesContext.Provider>
  );
}

PacientesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const usePacientes = () => useContext(PacientesContext);