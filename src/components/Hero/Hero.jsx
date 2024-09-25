import React, { useEffect } from "react";
import "./Hero.css";
import Instagram from "../../assets/instagram.svg";

export default function Hero() {
  useEffect(() => {
    console.log("Hero component mounted"); // Verificar se o componente foi montado

    // Função para fazer o ping ao servidor
    const pingServer = () => {
      console.log("Attempting to ping server..."); // Indicar que a função de ping foi chamada

      fetch("https://testserver-2p40.onrender.com/teste")
        .then((response) => {
          if (response.ok) {
            return response.text(); // Pegar o corpo da resposta como texto
          } else {
            console.error("Erro no ping ao servidor:", response.status);
          }
        })
        .then((data) => {
          if (data) {
            console.log("Resposta da API:", data); // Exibir a resposta da API no console
          }
        })
        .catch((error) => {
          console.error("Erro ao fazer o ping:", error);
        });
    };

    // Fazer o ping inicial
    pingServer();

    // Configurar o intervalo para fazer o ping a cada 2 minutos (120.000 ms)
    const intervalId = setInterval(pingServer, 120000);

    // Limpar o intervalo ao desmontar o componente
    return () => {
      console.log("Cleaning up interval");
      clearInterval(intervalId);
    };
  }, []); // O array vazio garante que o efeito só será executado uma vez, após o componente ser montado

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Seja bem-vindo!</h1>
        <p className="hero-paragraph">
          Raízes é uma plataforma dedicada à identificação de indivíduos e
          famílias em situação de alto risco para câncer hereditário. Essa
          plataforma auxilia você a:
        </p>
        <ul className="hero-list">
          <li className="hero-list-item">
            Coletar e registrar a história pessoal e familiar de câncer de seu
            paciente por meio de perguntas direcionadas.
          </li>
          <li className="hero-list-item">
            Facilitar o encaminhamento de indivíduos de alto risco a serviços
            especializados.
          </li>
        </ul>
        <button className="hero-startButton">Começar avaliação</button>
      </div>
      <div>
        <img className="instagram" src={Instagram} alt="instagram raízes" />
      </div>
    </div>
  );
}
