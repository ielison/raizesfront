import { useState } from "react";
import "./Sobre.css";
import Logo from "../../assets/logo-sobre.svg";
import Register1 from "../../components/Register1/Register1"; // Import the Register1 modal

export default function Sobre() {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openRegisterModal = () => {
    console.log("ahe");
    setRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
  };

  return (
    <>
      <div className="sobre-container">
        <main className="sobre-content">
          <section className="sobre-section1">
            <div className="section1-text">
              <h2 className="h2-sobre">Sobre Nós</h2>
              <p>
                O Projeto Raízes nasceu em 2024 a partir da visão inovadora e do
                trabalho dedicado de Thalita Targino, uma enfermeira
                oncogeneticista apaixonada pela coleta e análise da história
                familiar de câncer. Com uma vasta experiência na área de
                oncologia e genética, Thalita identificou a necessidade de uma
                ferramenta eficaz para auxiliar profissionais de saúde na
                identificação de indivíduos com alto risco de câncer
                hereditário.
              </p>
            </div>
            <div>
              <img className="logo-sobre" src={Logo} alt="Logo Raízes" />
            </div>
          </section>

          <section className="sobre-section2">
            <div className="section2-missao">
              <h2 className="h2-sobre">Nossa Missão</h2>
              <p>
                A missão do Projeto Raízes é aprimorar a prática clínica e
                oferecer suporte fundamental para a identificação precoce de
                riscos hereditários de câncer. Acreditamos que a coleta
                detalhada e precisa da história familiar de câncer é um passo
                crucial para proporcionar cuidados personalizados e
                direcionados. Nossa ferramenta é projetada para ajudar os
                profissionais de saúde a tomar decisões informadas, baseadas em
                dados concretos, facilitando o encaminhamento para serviços
                especializados em genética e, assim, melhorando a qualidade do
                atendimento oferecido aos pacientes.
              </p>
            </div>
            <div className="section2-oferecemos">
              <h2 className="h2-sobre">O Que Oferecemos</h2>
              <ul>
                <li>
                  <strong>Identificar Pacientes de Alto Risco:</strong> Realizar
                  uma triagem detalhada para identificar indivíduos com maior
                  probabilidade de condições hereditárias de câncer.
                </li>
                <li>
                  <strong>Tomar Decisões Informadas:</strong> Acessar dados
                  essenciais para fazer escolhas clínicas bem fundamentadas e
                  orientadas para o paciente.
                </li>
                <li>
                  <strong>Facilitar Encaminhamentos:</strong> Auxiliar e
                  agilizar o processo de encaminhamento para serviços de
                  genética e outras especialidades conforme necessário.
                </li>
              </ul>
            </div>

            <div className="section2-visao">
              <h2 className="h2-sobre">Nossa Visão</h2>
              <p>
                Nosso objetivo é transformar a forma como a história familiar de
                câncer é coletada e utilizada, proporcionando uma abordagem mais
                sistemática e eficiente para a avaliação de risco. Ao melhorar a
                comunicação e a integração entre profissionais de saúde e
                especialistas em genética, buscamos contribuir para um
                diagnóstico precoce e para a implementação de estratégias
                preventivas mais eficazes.
              </p>
            </div>
          </section>

          <section className="sobre-section3">
            <h2 className="h2-sobre">Agradecimentos</h2>
            <p>
              Agradecemos profundamente o seu empenho em cuidar da saúde dos
              seus pacientes e de suas famílias. Seu trabalho é fundamental na
              construção de um futuro onde o câncer pode ser detectado e tratado
              com mais eficácia e onde cada paciente recebe o cuidado e a
              atenção que merece.
            </p>
            <p>
              Ainda não tem uma conta? Não perca a oportunidade de fazer parte
              deste projeto inovador.{" "}
              <span className="register-button" onClick={openRegisterModal}>
                Registre-se agora mesmo!
              </span>
            </p>
            <p>
              Junte-se a nós na missão de transformar a saúde e o cuidado com o
              câncer através do conhecimento e da inovação.
            </p>
          </section>
        </main>

        {isRegisterModalOpen && (
          <Register1
            isOpen={isRegisterModalOpen}
            onClose={closeRegisterModal}
          />
        )}
      </div>
    </>
  );
}
