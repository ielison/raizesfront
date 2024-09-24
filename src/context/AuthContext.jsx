import { createContext, useState, useContext } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [nome, setNome] = useState(""); // Adiciona o estado para o nome

  const login = (idUser, nome) => {
    //console.table([{ "Login": "Sucesso", "ID": idUser, "Nome": nome }]);
    setIsLoggedIn(true);
    setIdUser(idUser); // Armazena o idUser
    setNome(nome); // Armazena o nome
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIdUser(null);
    setNome(""); // Limpa o nome ao fazer logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, idUser, nome, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Adiciona validação de PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
