import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { cancerOptions } from "../../data/cancerOptions";
import { ageOptions } from "../../data/ageOptions"; // Import ageOptions
import "./FilhosFilhas2.css";

export default function FilhosFilhas2({ onFormChange }) {
  const [hasChildren, setHasChildren] = useState(null);
  const [hasCancer, setHasCancer] = useState(false);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    // Atualiza os dados dos filhos e filhas ao mudar
    onFormChange({
      filhosList: children.map((child, index) => ({
        id: index, // Adicionando o id com base no índice (ou você pode implementar outra lógica de ID)
        temFilhos: true, // Definindo como true, já que estamos informando filhos
        qtdFilhos: children.length, // Total de filhos informados
        teveCancer: hasCancer, // Status se algum teve câncer
        qtdFilhosCancer: child.type.length > 0 ? 1 : 0, // Contagem se o filho teve câncer
        sexo: child.sex,
        mesmoPais: true, // Aqui pode ser uma lógica que você deseja implementar
        outroCancerList: child.type.map((opt) => ({
          id: 0, // Lógica para ID de outro câncer, se necessário
          idadeDiagnostico: child.age?.value || child.age || "", // Idade do diagnóstico
          tipoCancer: opt.label,
        })),
      })),
    });
  }, [children, hasCancer, onFormChange]); // Adicione hasCancer às dependências

  const handleAddChild = () => {
    setChildren([...children, { sex: "", type: [], age: "", showAgeDropdown: false }]);
  };

  const toggleAgeDropdown = (index) => {
    const newChildren = [...children];
    newChildren[index].showAgeDropdown = !newChildren[index].showAgeDropdown;
    setChildren(newChildren);
  };

  return (
    <div className="ff-form-container">
      <label>
        O Sr(a) tem filhos e filhas?
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="hasChildren"
              value="sim"
              checked={hasChildren === true}
              onChange={() => setHasChildren(true)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasChildren"
              value="nao"
              checked={hasChildren === false}
              onChange={() => setHasChildren(false)}
            />
            Não
          </label>
        </div>
      </label>

      {hasChildren && (
        <>
          <div className="qtd-filhos">
            <label>
              Quantidade de filhos
              <input
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  e.target.value = value >= 0 ? value : 0;
                }}
              />
            </label>
            <label>
              Quantidade de filhas
              <input
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  e.target.value = value >= 0 ? value : 0;
                }}
              />
            </label>
          </div>

          <label>
            Algum deles já teve câncer?
            <div className="checkbox-group">
              <label>
                <input
                  type="radio"
                  name="hasCancer"
                  value="sim"
                  checked={hasCancer === true}
                  onChange={() => setHasCancer(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="hasCancer"
                  value="nao"
                  checked={hasCancer === false}
                  onChange={() => setHasCancer(false)}
                />
                Não
              </label>
            </div>
          </label>

          {hasCancer && (
            <>
              {children.map((child, index) => (
                <div key={index} className="child-container">
                  <label>
                    Sexo
                    <Select
                      options={[
                        { value: "masculino", label: "Masculino" },
                        { value: "feminino", label: "Feminino" },
                      ]}
                      onChange={(selectedOption) => {
                        const newChildren = [...children];
                        newChildren[index].sex = selectedOption.value;
                        setChildren(newChildren);
                      }}
                      placeholder="Selecione o sexo"
                    />
                  </label>
                  <label>
                    Tipo de câncer
                    <Select
                      isMulti
                      placeholder="Selecione o tipo de câncer"
                      options={cancerOptions}
                      value={child.type}
                      onChange={(selectedOptions) => {
                        const newChildren = [...children];
                        newChildren[index].type = selectedOptions;
                        setChildren(newChildren);
                      }}
                    />
                  </label>
                  <label className="ff-idade">
                    <div className="ff">
                      Idade
                      {child.showAgeDropdown ? (
                        <Select
                          placeholder="Selecione..."
                          options={ageOptions}
                          value={child.age}
                          onChange={(selectedOption) => {
                            const newChildren = [...children];
                            newChildren[index].age = selectedOption; 
                            setChildren(newChildren);
                          }}
                        />
                      ) : (
                        <input
                          type="number"
                          value={child.age}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newChildren = [...children];
                            newChildren[index].age = value >= 0 ? value : 0; 
                            setChildren(newChildren);
                          }}
                        />
                      )}
                    </div>
                    <button type="button" onClick={() => toggleAgeDropdown(index)}>
                      {child.showAgeDropdown ? "Digitar idade" : "Não sei"}
                    </button>
                  </label>
                </div>
              ))}
              <button className="ff-btn-add" onClick={handleAddChild}>
                Informar +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

FilhosFilhas2.propTypes = {
  onFormChange: PropTypes.func.isRequired,
};
