import Logo from "../../assets/logofooter.svg";
import Instagram from "../../assets/instagram.svg";
import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <img className="logo-footer" src={Logo} alt="logo raízes" />
      <img className="instagram" src={Instagram} alt="instagram raízes" />
    </footer>
  );
}
