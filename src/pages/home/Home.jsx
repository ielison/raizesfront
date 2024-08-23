import HomeTopbar from "../../components/HomeTopbar/HomeTopbar";
import HomeHero from "../../components/HomeHero/HomeHero";
import "./Home.css";

export default function Home() {
  return (
    <div className="homepage">
    <HomeTopbar />
    <HomeHero />
    </div>
  );
}
