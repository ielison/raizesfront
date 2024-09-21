import { useState } from "react";
import Select from "react-select";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import "./AvosPaternos2.css";
import InfoIcon from "../../assets/information-2-fill.svg"; // Importe o SVG aqui

export default function AvosPaternos2() {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [noKnowledge, setNoKnowledge] = useState(false);
  const [grandfatherrHadCancer, setGrandfatherrHadCancer] = useState(false);
  const [grandfatherHadCancer, setGrandfatherHadCancer] = useState(false);
  const [grandfatherrCancerDetails, setGrandfatherrCancerDetails] = useState({
    type: null,
    age: "",
    showAgeDropdown: false,
  });
  const [grandfatherCancerDetails, setGrandfatherCancerDetails] = useState({
    type: null,
    age: "",
    showAgeDropdown: false,
  });

  const [additionalGrandfatherrCancer, setAdditionalGrandfatherrCancer] =
    useState([]);
  const [additionalGrandfatherCancer, setAdditionalGrandfatherCancer] =
    useState([]);

  const handleNoKnowledgeChange = () => {
    setNoKnowledge((prev) => !prev);
    if (!noKnowledge) {
      setGrandfatherrHadCancer(false);
      setGrandfatherHadCancer(false);
      setGrandfatherrCancerDetails({
        type: null,
        age: "",
        showAgeDropdown: false,
      });
      setGrandfatherCancerDetails({
        type: null,
        age: "",
        showAgeDropdown: false,
      });
      setAdditionalGrandfatherrCancer([]);
      setAdditionalGrandfatherCancer([]);
    }
  };

  const handleNoGrandparentsCancerChange = () => {
    setGrandfatherrHadCancer(false);
    setGrandfatherHadCancer(false);
    setNoKnowledge(false);
  };

  const handleAgeToggle = (setDetails) => {
    setDetails((prev) => ({ ...prev, showAgeDropdown: !prev.showAgeDropdown }));
  };

  const addMoreGrandfatherrCancer = () => {
    setAdditionalGrandfatherrCancer((prev) => [
      ...prev,
      { type: null, age: "", showAgeDropdown: false },
    ]);
  };

  const addMoreGrandfatherCancer = () => {
    setAdditionalGrandfatherCancer((prev) => [
      ...prev,
      { type: null, age: "", showAgeDropdown: false },
    ]);
  };

  const handleAdditionalGrandfatherrAgeToggle = (index) => {
    const newDetails = [...additionalGrandfatherrCancer];
    newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
    setAdditionalGrandfatherrCancer(newDetails);
  };

  const handleAdditionalGrandfatherAgeToggle = (index) => {
    const newDetails = [...additionalGrandfatherCancer];
    newDetails[index].showAgeDropdown = !newDetails[index].showAgeDropdown;
    setAdditionalGrandfatherCancer(newDetails);
  };

  return (
    <div className="avosm-form-container">
      <div className="avosm-grupo">
        <label className="avosm-label">
          Os seus avós paternos já tiveram câncer?
          <div className="avosm-checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={grandfatherrHadCancer}
                onChange={() => setGrandfatherrHadCancer(!grandfatherrHadCancer)}
                className="avosm-checkbox"
              />
              Minha avó teve câncer
            </label>
            <label>
              <input
                type="checkbox"
                checked={grandfatherHadCancer}
                onChange={() => setGrandfatherHadCancer(!grandfatherHadCancer)}
                className="avosm-checkbox"
              />
              Meu avô teve câncer
            </label>
            <label>
              <input
                type="checkbox"
                checked={
                  !grandfatherrHadCancer && !grandfatherHadCancer && !noKnowledge
                }
                onChange={handleNoGrandparentsCancerChange}
                className="avosm-checkbox"
              />
              Nenhum dos meus avós paternos foram acometidos
            </label>
            <label>
              <input
                type="checkbox"
                checked={noKnowledge}
                onChange={handleNoKnowledgeChange}
                className="avosm-checkbox"
              />
              Não tenho conhecimento da saúde dos meus avós paternos
            </label>
          </div>
        </label>

        {!noKnowledge && (
          <>
            {grandfatherrHadCancer && (
              <>
                <label className="avosm-label">
                  Tipo de câncer da minha avó:
                  <Select
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={grandfatherrCancerDetails.type}
                    onChange={(selectedOption) =>
                      setGrandfatherrCancerDetails((prev) => ({
                        ...prev,
                        type: selectedOption,
                      }))
                    }
                    className="avosm-select"
                  />
                </label>
                <label className="avosm-label">
                  Idade
                  {grandfatherrCancerDetails.showAgeDropdown ? (
                    <Select
                      options={ageOptions}
                      value={grandfatherrCancerDetails.age}
                      onChange={(selectedOption) =>
                        setGrandfatherrCancerDetails((prev) => ({
                          ...prev,
                          age: selectedOption,
                        }))
                      }
                      className="avosm-select"
                    />
                  ) : (
                    <input
                      type="number"
                      value={grandfatherrCancerDetails.age}
                      onChange={(e) =>
                        setGrandfatherrCancerDetails((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      className="avosm-input"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleAgeToggle(setGrandfatherrCancerDetails)}
                    className="avosm-toggle-button"
                  >
                    {grandfatherrCancerDetails.showAgeDropdown
                      ? "Digitar idade"
                      : "Não sei"}
                  </button>
                </label>

                {additionalGrandfatherrCancer.map((details, index) => (
                  <div key={index}>
                    <label className="avosm-label">
                      Tipo de câncer adicional da minha avó:
                      <Select
                        placeholder="Selecione o tipo de câncer"
                        options={cancerOptions}
                        value={details.type}
                        onChange={(selectedOption) => {
                          const newDetails = [...additionalGrandfatherrCancer];
                          newDetails[index].type = selectedOption;
                          setAdditionalGrandfatherrCancer(newDetails);
                        }}
                        className="avosm-select"
                      />
                    </label>
                    <label className="avosm-label">
                      Idade
                      {details.showAgeDropdown ? (
                        <Select
                          options={ageOptions}
                          value={details.age}
                          onChange={(selectedOption) => {
                            const newDetails = [...additionalGrandfatherrCancer];
                            newDetails[index].age = selectedOption;
                            setAdditionalGrandfatherrCancer(newDetails);
                          }}
                          className="avosm-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={details.age}
                          onChange={(e) => {
                            const newDetails = [...additionalGrandfatherrCancer];
                            newDetails[index].age = e.target.value;
                            setAdditionalGrandfatherrCancer(newDetails);
                          }}
                          className="avosm-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleAdditionalGrandfatherrAgeToggle(index)
                        }
                        className="avosm-toggle-button"
                      >
                        {details.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        } // Alterna o tooltip ao clicar
                      />
                      {tooltipIndex === index && ( // Exiba o tooltip apenas se o index coincidir
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMoreGrandfatherrCancer}
                  className="nn-btn-add"
                >
                  Informar+
                </button>
              </>
            )}

            {grandfatherHadCancer && (
              <>
                <label className="avosm-label">
                  Tipo de câncer do meu avô:
                  <Select
                    placeholder="Selecione o tipo de câncer"
                    options={cancerOptions}
                    value={grandfatherCancerDetails.type}
                    onChange={(selectedOption) =>
                      setGrandfatherCancerDetails((prev) => ({
                        ...prev,
                        type: selectedOption,
                      }))
                    }
                    className="avosm-select"
                  />
                </label>
                <label className="avosm-label">
                  Idade
                  {grandfatherCancerDetails.showAgeDropdown ? (
                    <Select
                      options={ageOptions}
                      value={grandfatherCancerDetails.age}
                      onChange={(selectedOption) =>
                        setGrandfatherCancerDetails((prev) => ({
                          ...prev,
                          age: selectedOption,
                        }))
                      }
                      className="avosm-select"
                    />
                  ) : (
                    <input
                      type="number"
                      value={grandfatherCancerDetails.age}
                      onChange={(e) =>
                        setGrandfatherCancerDetails((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      className="avosm-input"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleAgeToggle(setGrandfatherCancerDetails)}
                    className="avosm-toggle-button"
                  >
                    {grandfatherCancerDetails.showAgeDropdown
                      ? "Digitar idade"
                      : "Não sei"}
                  </button>
                </label>

                {additionalGrandfatherCancer.map((details, index) => (
                  <div key={index}>
                    <label className="avosm-label">
                      Tipo de câncer adicional do meu avô:
                      <Select
                        placeholder="Selecione o tipo de câncer"
                        options={cancerOptions}
                        value={details.type}
                        onChange={(selectedOption) => {
                          const newDetails = [...additionalGrandfatherCancer];
                          newDetails[index].type = selectedOption;
                          setAdditionalGrandfatherCancer(newDetails);
                        }}
                        className="avosm-select"
                      />
                    </label>
                    <label className="avosm-label">
                      Idade
                      {details.showAgeDropdown ? (
                        <Select
                          options={ageOptions}
                          value={details.age}
                          onChange={(selectedOption) => {
                            const newDetails = [...additionalGrandfatherCancer];
                            newDetails[index].age = selectedOption;
                            setAdditionalGrandfatherCancer(newDetails);
                          }}
                          className="avosm-select"
                        />
                      ) : (
                        <input
                          type="number"
                          value={details.age}
                          onChange={(e) => {
                            const newDetails = [...additionalGrandfatherCancer];
                            newDetails[index].age = e.target.value;
                            setAdditionalGrandfatherCancer(newDetails);
                          }}
                          className="avosm-input"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleAdditionalGrandfatherAgeToggle(index)
                        }
                        className="avosm-toggle-button"
                      >
                        {details.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(index === tooltipIndex ? null : index)
                        } // Alterna o tooltip ao clicar
                      />
                      {tooltipIndex === index && ( // Exiba o tooltip apenas se o index coincidir
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMoreGrandfatherCancer}
                  className="nn-btn-add"
                >
                  Informar+
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
