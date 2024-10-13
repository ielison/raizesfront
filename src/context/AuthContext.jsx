import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const { isLoggedIn, idUser, nome } = JSON.parse(storedAuth);
        setIsLoggedIn(isLoggedIn);
        setIdUser(idUser);
        setNome(nome);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (idUser, nome) => {
    setIsLoggedIn(true);
    setIdUser(idUser);
    setNome(nome);
    localStorage.setItem('auth', JSON.stringify({ isLoggedIn: true, idUser, nome }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIdUser(null);
    setNome("");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, idUser, nome, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};