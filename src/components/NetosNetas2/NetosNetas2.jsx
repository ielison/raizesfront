import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions";
import InfoIcon from "../../assets/information-2-fill.svg";
import DeleteIcon from "../../assets/trash.svg";
import "./NetosNetas2.css";

export default function NetosNetas2({ onFormChange }) {
  const [temNetos, setTemNetos] = useState(() => {
    return JSON.parse(localStorage.getItem("temNetos")) || false;
  });

  const [teveCancer, setTeveCancer] = useState(() => {
    return JSON.parse(localStorage.getItem("teveCancer")) || false;
  });

  const [qtdNetos, setQtdNetos] = useState(() => {
    return JSON.parse(localStorage.getItem("qtdNetos")) || 0;
  });

  const [qtdNetas, setQtdNetas] = useState(() => {
    return JSON.parse(localStorage.getItem("qtdNetas")) || 0;
  });

  const [netosList, setNetosList] = useState(() => {
    return JSON.parse(localStorage.getItem("netosList")) || [];
  });

  const [tooltipIndex, setTooltipIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("temNetos", JSON.stringify(temNetos));
    localStorage.setItem("teveCancer", JSON.stringify(teveCancer));
    localStorage.setItem("qtdNetos", JSON.stringify(qtdNetos));
    localStorage.setItem("qtdNetas", JSON.stringify(qtdNetas));
    localStorage.setItem("netosList", JSON.stringify(netosList));

    let updatedNetosList;
    if (!temNetos) {
      updatedNetosList = [
        {
          id: 0,
          temNeto: false,
          qtdNetos: 0,
          teveCancer: false,
          qtdNetosCancer: 0,
          sexo: "",
          outroCancerList: [],
        },
      ];
    } else {
      const totalNetos = qtdNetos + qtdNetas;
      updatedNetosList = netosList.map((neto, index) => ({
        id: index,
        temNeto: temNetos,
        qtdNetos: totalNetos,
        teveCancer: teveCancer,
        qtdNetosCancer: netosList.filter((n) => n.outroCancerList.length > 0)
          .length,
        sexo: neto.sexo,
        outroCancerList:
          neto.outroCancerList.length > 0
            ? neto.outroCancerList
            : [
                {
                  id: 0,
                  idadeDiagnostico: 0,
                  tipoCancer: "",
                },
              ],
      }));
    }

    onFormChange({ netosList: updatedNetosList });
  }, [temNetos, teveCancer, qtdNetos, qtdNetas, netosList, onFormChange]);

  const handleAddNeto = () => {
    setNetosList([...netosList, { sexo: "", outroCancerList: [] }]);
  };

  const handleDeleteNeto = (indexToDelete) => {
    setNetosList(netosList.filter((_, index) => index !== indexToDelete));
  };

  const toggleAgeDropdown = (netoIndex, cancerIndex) => {
    const updatedNetosList = [...netosList];
    const cancer = updatedNetosList[netoIndex].outroCancerList[cancerIndex];
    cancer.showAgeDropdown = !cancer.showAgeDropdown;
    setNetosList(updatedNetosList);
  };

  return (
    <div className="nn-form-container">
      <label>
        O(A) Sr(a) tem netos e netas?
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="temNetos"
              value="sim"
              checked={temNetos === true}
              onChange={() => setTemNetos(true)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="temNetos"
              value="nao"
              checked={temNetos === false}
              onChange={() => setTemNetos(false)}
            />
            Não
          </label>
        </div>
      </label>

      {temNetos && (
        <>
          <div className="qtd-netos">
            <label>
              Quantidade de neto(s)
              <input
                type="number"
                value={qtdNetos}
                onChange={(e) =>
                  setQtdNetos(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
            </label>
            <label>
              Quantidade de neta(s)
              <input
                type="number"
                value={qtdNetas}
                onChange={(e) =>
                  setQtdNetas(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
            </label>
          </div>

          <label>
            Algum deles já teve câncer ou algum outro tipo de neoplasia?
            <div className="checkbox-group">
              <label>
                <input
                  type="radio"
                  name="teveCancer"
                  value="sim"
                  checked={teveCancer === true}
                  onChange={() => setTeveCancer(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="teveCancer"
                  value="nao"
                  checked={teveCancer === false}
                  onChange={() => setTeveCancer(false)}
                />
                Não
              </label>
            </div>
          </label>

          {teveCancer && (
            <>
              {netosList.map((neto, netoIndex) => (
                <div key={netoIndex} className="grandchild-container">
                  <label>
                    Sexo
                    <Select
                      options={[
                        { value: "masculino", label: "Masculino" },
                        { value: "feminino", label: "Feminino" },
                      ]}
                      onChange={(selectedOption) => {
                        const updatedNetosList = [...netosList];
                        updatedNetosList[netoIndex].sexo = selectedOption.value;
                        setNetosList(updatedNetosList);
                      }}
                      placeholder="Selecione o sexo"
                    />
                  </label>
                  <label>
                    Selecione o tipo de câncer ou neoplasia
                    <Select
                      isMulti
                      placeholder="Selecione o tipo de câncer"
                      options={cancerOptions}
                      value={neto.outroCancerList.map((cancer) => ({
                        value: cancer.tipoCancer,
                        label: cancer.tipoCancer,
                      }))}
                      onChange={(selectedOptions) => {
                        const updatedNetosList = [...netosList];
                        updatedNetosList[netoIndex].outroCancerList =
                          selectedOptions.map((opt, index) => ({
                            id: index,
                            tipoCancer: opt.label,
                            idadeDiagnostico: 0,
                          }));
                        setNetosList(updatedNetosList);
                      }}
                    />
                  </label>

                  {neto.outroCancerList.map((cancer, cancerIndex) => (
                    <label key={cancerIndex} className="nn-idade">
                      <div className="nn">
                        Idade do diagnóstico ({cancer.tipoCancer})
                        {cancer.showAgeDropdown ? (
                          <Select
                            placeholder="Selecione..."
                            options={ageOptions}
                            value={ageOptions.find(
                              (opt) => opt.value === cancer.idadeDiagnostico
                            )}
                            onChange={(selectedOption) => {
                              const updatedNetosList = [...netosList];
                              updatedNetosList[netoIndex].outroCancerList[
                                cancerIndex
                              ].idadeDiagnostico = selectedOption.value;
                              setNetosList(updatedNetosList);
                            }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={cancer.idadeDiagnostico}
                            onChange={(e) => {
                              const updatedNetosList = [...netosList];
                              updatedNetosList[netoIndex].outroCancerList[
                                cancerIndex
                              ].idadeDiagnostico = Math.max(
                                0,
                                parseInt(e.target.value) || 0
                              );
                              setNetosList(updatedNetosList);
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleAgeDropdown(netoIndex, cancerIndex)
                        }
                      >
                        {cancer.showAgeDropdown ? "Digitar idade" : "Não sei"}
                      </button>
                      <img
                        src={InfoIcon}
                        alt="Info"
                        className="info-icon-idade"
                        onClick={() =>
                          setTooltipIndex(
                            tooltipIndex === netoIndex ? null : netoIndex
                          )
                        }
                      />

                      {tooltipIndex === netoIndex && (
                        <div className="tooltip-idade">
                          Caso seu paciente não saiba a idade exata do
                          diagnóstico de câncer em um familiar, questione se foi
                          antes ou depois dos 50 anos. Essa estimativa é mais
                          fácil de lembrar e ainda oferece um corte de idade
                          útil para a avaliação de risco.
                        </div>
                      )}
                    </label>
                  ))}

                  <button
                    className="nn-btn-delete"
                    type="button"
                    onClick={() => handleDeleteNeto(netoIndex)}
                  >
                    <img src={DeleteIcon} alt="Deletar" />
                  </button>
                </div>
              ))}
              <button className="nn-btn-add" onClick={handleAddNeto}>
                Informar +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

NetosNetas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
