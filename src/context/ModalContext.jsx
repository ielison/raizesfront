import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

// Context for modals
const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [currentModal, setCurrentModal] = useState(null);

  const openModal = (modalName) => setCurrentModal(modalName);
  const closeModal = () => setCurrentModal(null);
  const closeCurrentModal = () => {
    // Implement logic to close the current modal if needed
    setCurrentModal(null);
  };

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        openModal,
        closeModal,
        closeCurrentModal, // Add this if you need to close the current modal
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
