import React, { useEffect } from "react";
import HomeHero from "../../components/HomeHero/HomeHero";
import "./Home.css";

export default function Home() {
  useEffect(() => {
    // Função para fazer o ping ao servidor
    const pingServer = () => {
      fetch("https://testserver-2p40.onrender.com/teste")
        .then((response) => {
          if (response.ok) {
            console.log("Ping bem-sucedido ao servidor.");
          } else {
            console.error("Erro no ping ao servidor:", response.status);
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
    return () => clearInterval(intervalId);
  }, []); // O array vazio garante que o efeito só será executado uma vez, após o componente ser montado

  return (
    <div className="homepage">
      <HomeHero />
    </div>
  );
}
