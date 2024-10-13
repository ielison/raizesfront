import PropTypes from "prop-types";

const Finalizado1 = ({ onClose }) => {
  return (
    <div className="finalizado-modal">
      <h2>Processo Finalizado!</h2>
      <p>Obrigado por enviar as informações.</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};
Finalizado1.propTypes = {
  onClose: PropTypes.func.isRequired,
};



export default Finalizado1;
