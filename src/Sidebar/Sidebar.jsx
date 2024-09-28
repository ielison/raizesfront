import { useState } from 'react';
import PropTypes from 'prop-types';
import { sidebarData } from '../../data/sidebarData';
import './Sidebar.css';

function Sidebar({ onNavigate }) {
  const [expandedEtapa, setExpandedEtapa] = useState(null);

  const handleToggle = (etapa) => {
    setExpandedEtapa(expandedEtapa === etapa ? null : etapa);
  };

  const renderItems = (etapa) => {
    return (
      <ul className={`sidebar-items ${expandedEtapa === etapa ? 'expanded' : ''}`}>
        {sidebarData[etapa].items.map((item, index) => (
          <li key={index} className="sidebar-item" onClick={() => onNavigate(item)}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sidebar">
      <ul>
        {Object.keys(sidebarData).map((etapa) => (
          <li key={etapa}>
            <button
              className="sidebar-title"
              onClick={() => handleToggle(etapa)}
            >
              {sidebarData[etapa].title}
              <span className="arrow">
                {expandedEtapa === etapa ? '▲' : '▼'}
              </span>
            </button>
            {renderItems(etapa)}
          </li>
        ))}
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  activeEtapa: PropTypes.string,
  onNavigate: PropTypes.func.isRequired, // Adicione a prop para navegação
};

export default Sidebar;
