import { useState } from "react";
import "./MeusPacientes.css"; // Make sure to create this CSS file for styling
import pacientesData from "../../data/pacientes.js"; // Import the patient data

export default function MeusPacientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPacientes = pacientesData.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="meus-pacientes">
      <h1 className="h1-pacientes">Meus Pacientes</h1>
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
      <div className="pacientes-list">
        {filteredPacientes.map((paciente) => (
          <div key={paciente.id} className="paciente-card">
            <div className="paciente-info">
              <div className="paciente-icon">👤</div>
              <div className="paciente-details">
                <span className="paciente-nome">{paciente.nome}</span>
                <span className="paciente-idade">{paciente.idade} anos</span>
              </div>
            </div>
            <div className="divider"></div>
            <div className="paciente-contato">
              <span>Contato: {paciente.telefone}</span>
              <span>Data da Consulta: {paciente.dataConsulta}</span>
              <span>Tipo de Câncer: {paciente.tipoCancer}</span>
            </div>
            <div className="divider"></div>
            <div className="consulta-oncogenetica">
              {paciente.consultaOncogenetica
                ? "Precisa consulta oncogenética"
                : "Não precisa consulta oncogenética"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
