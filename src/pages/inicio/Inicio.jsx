import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import Topbar from "../../components/Topbar/Topbar";
import "./Inicio.css";


export default function Inicio() {
  return (
    <div className="app__itens">
      <Topbar />
      <Hero />
      <Footer />
    </div>
  );
}
