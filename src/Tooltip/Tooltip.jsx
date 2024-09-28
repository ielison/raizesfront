
import PropTypes from 'prop-types'; // Importando PropTypes
import './Tooltip.css'; // Importando o CSS do tooltip

const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired, // 'text' deve ser uma string e é obrigatório
  children: PropTypes.node.isRequired, // 'children' deve ser um nó React e é obrigatório
};

export default Tooltip;
