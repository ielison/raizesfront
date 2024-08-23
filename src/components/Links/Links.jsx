import { useState } from "react";
import "./Links.css";
import { linksUteis } from "../../data/links";
import { servicosPublicos } from "../../data/servicos";
import LinkImage from "../../assets/link.svg";
import SearchIcon from "../../assets/search-icon.svg"; // Novo ícone de busca

function Links() {
  const [activeTab, setActiveTab] = useState("linksUteis");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to the first page when changing tabs
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when changing search term
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD") // Decomposição de caracteres
      .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
      .toLowerCase(); // Converte para minúsculas
  };

  const filteredLinksUteis = linksUteis.filter((link) =>
    normalizeText(link.name).includes(normalizeText(searchTerm))
  );

  const filteredServicosPublicos = servicosPublicos.filter((servico) => {
    const normalizedSearch = normalizeText(searchTerm);
    return (
      normalizeText(servico.name).includes(normalizedSearch) ||
      normalizeText(servico.address).includes(normalizedSearch) ||
      normalizeText(servico.cityState).includes(normalizedSearch) ||
      normalizeText(servico.responsible).includes(normalizedSearch) ||
      normalizeText(servico.email).includes(normalizedSearch) ||
      normalizeText(servico.phone).includes(normalizedSearch)
    );
  });

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredServicosPublicos.length / itemsPerPage);

  // Get the items for the current page
  const paginatedServicosPublicos = filteredServicosPublicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="linksuteis__container">
      <div className="linksuteis__content">
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
          <div className="linksuteis__tab-content">
            {filteredLinksUteis.length > 0 ? (
              filteredLinksUteis.map((link, index) => (
                <div className="linksuteis__link-item" key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <span>{link.name}</span> {/* Exibe o nome do link */}
                    <img src={LinkImage} alt="Link Icon" />
                    <span className="url">{link.url}</span>{" "}
                    {/* Exibe o endereço do link */}
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
              <p>Nenhum serviço encontrado.</p>
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
    </div>
  );
}

export default Links;
