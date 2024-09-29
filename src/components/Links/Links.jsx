import { useState } from "react";
import "./Links.css";
import { linksUteis } from "../../data/links";
import { servicosPublicos } from "../../data/servicos";
import SearchIcon from "../../assets/search-icon.svg";

// List of Brazilian states
const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

function Links() {
  const [activeTab, setActiveTab] = useState("linksUteis");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState("todos");
  const itemsPerPage = 15;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setCurrentPage(1);
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredLinksUteis = linksUteis.filter((link) =>
    normalizeText(link.name).includes(normalizeText(searchTerm))
  );

  const filteredServicosPublicos = servicosPublicos.filter((servico) => {
    const normalizedSearch = normalizeText(searchTerm);
    const isInState =
      selectedState === "todos" ||
      normalizeText(servico.cityState.split("/")[1].trim()).includes(
        normalizeText(selectedState)
      );

    return (
      isInState &&
      (normalizeText(servico.name).includes(normalizedSearch) ||
        normalizeText(servico.address).includes(normalizedSearch) ||
        normalizeText(servico.cityState).includes(normalizedSearch) ||
        normalizeText(servico.responsible).includes(normalizedSearch) ||
        normalizeText(servico.email).includes(normalizedSearch) ||
        normalizeText(servico.phone).includes(normalizedSearch))
    );
  });

  const totalPages = Math.ceil(filteredServicosPublicos.length / itemsPerPage);

  const paginatedServicosPublicos = filteredServicosPublicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="linksuteis__container">
      <div className="linksuteis__background">
        <div className="linksuteis__search-wrapper">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="linksuteis__search-field"
          />
          <img
            src={SearchIcon}
            alt="Search Icon"
            className="linksuteis__search-icon"
          />
        </div>
      </div>

      <div className="linksuteis__tabs">
        <button
          className={`linksuteis__tab ${
            activeTab === "linksUteis" ? "active" : ""
          }`}
          onClick={() => handleTabChange("linksUteis")}
        >
          Links Úteis
        </button>
        <button
          className={`linksuteis__tab ${
            activeTab === "servicosPublicos" ? "active" : ""
          }`}
          onClick={() => handleTabChange("servicosPublicos")}
        >
          Serviços Públicos de Genética no Brasil
        </button>
      </div>

      {activeTab === "linksUteis" && (
        <div className="linksuteis__link-grid">
          {filteredLinksUteis.length > 0 ? (
            filteredLinksUteis.map((link, index) => (
              <div className="linksuteis__link-item" key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <div>
                    <span>{link.name}</span>
                  </div>
                  
                </a>
              </div>
            ))
          ) : (
            <p>Nenhum link encontrado.</p>
          )}
        </div>
      )}

      {activeTab === "servicosPublicos" && (
        <div className="linksuteis__tab-content">
          <div className="linksuteis__state-filter">
            <label className="label-estado" htmlFor="state-select">Filtrar por Estado:</label>
            <select
              id="state-select"
              value={selectedState}
              onChange={handleStateChange}
              className="linksuteis__state-dropdown"
            >
              <option value="todos">Todos</option>
              {estadosBrasileiros.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </option>
              ))}
            </select>
          </div>

          {paginatedServicosPublicos.length > 0 ? (
            paginatedServicosPublicos.map((servico, index) => (
              <div className="linksuteis__service-item" key={index}>
                <h3>{servico.name}</h3>
                <p>{servico.address}</p>
                <p>{servico.cityState}</p>
                <p>Responsável: {servico.responsible}</p>
                <p>Email: {servico.email}</p>
                <p>Telefone: {servico.phone}</p>
                <a
                  href={servico.location}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Localização
                </a>
              </div>
            ))
          ) : (
            <p className="sem-servico">Nenhum serviço encontrado.</p>
          )}

          {totalPages > 1 && (
            <div className="linksuteis__pagination">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Links;
