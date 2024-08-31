import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

// Context for modals
const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [currentModal, setCurrentModal] = useState(null);
  const [modalData, setModalData] = useState({}); // Adiciona estado para dados do modal

  const openModal = (modalName, data = {}) => {
    setCurrentModal(modalName);
    setModalData(data); // Armazena dados ao abrir o modal
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalData({}); // Limpa os dados ao fechar
  };

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        modalData, // Adiciona dados do modal ao contexto
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useModals() {
  return useContext(ModalContext);
}