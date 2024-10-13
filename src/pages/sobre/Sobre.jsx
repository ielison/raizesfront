import "./Sobre.css";
import Logo from "../../assets/LOGO 1.png";

export default function Sobre() {
  return (
    <div className="sobre-container">
      <div className="background-image"></div>
      <div className="content-container">
        <div className="logo-container">
          <img className="logo-sobre" src={Logo} alt="Logo Raízes" />
        </div>
        <main className="sobre-content">
          <section className="sobre-section1">
            <div className="section1-text">
              <p className="p-sobre">
                O Projeto Raízes foi idealizado em 2020, como fruto do trabalho de
                doutorado de Thalita Targino, enfermeira oncogeneticista, que
                sempre teve sua trajetória profissional conectada à genética. Ao
                longo da graduação, Thalita foi iniciação científica em um
                laboratório de genética, mas foi durante o mestrado que ela
                encontrou sua verdadeira paixão: a oncogenética, uma área que
                também guiou sua prática clínica durante a residência em
                oncologia, quando lidou diretamente com pacientes e suas
                histórias.
              </p>
              <p className="p-sobre">
                Durante esses dois anos de imersão na prática clínica, Thalita
                percebeu a necessidade urgente de uma plataforma que apoiasse os
                profissionais de saúde na coleta da história familiar de câncer
                de seus pacientes. A dificuldade em identificar pessoas com alto
                risco de câncer e fornecer estratégias de prevenção
                personalizadas foi o que impulsionou a criação do Projeto
                Raízes.
              </p>
              <p className="p-sobre">
                Hoje, o Raízes é uma plataforma de apoio à decisão clínica,
                desenvolvida para agilizar e facilitar a identificação de
                indivíduos em alto risco de câncer hereditário. Mais do que uma
                plataforma, é um recurso que acolhe, simplifica e fortalece a
                atuação dos profissionais de saúde. Aqui, cada história de vida
                importa, e estamos juntos para fazer a diferença.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
