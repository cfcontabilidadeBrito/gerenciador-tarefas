import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faSpotify,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Footer.module.css";

export default function Footer() {

  // Define a logo com base no tema
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>
          &copy; 2024 Gerenciador de Tarefas | Desenvolvido por 
          <a href="https://github.com/gabrielpereirabrito" target="_blank" rel="noopener noreferrer">
            <span>Gabriel Brito</span>
          </a>
        </p>
      </div>
      
      {/* Ícones das Redes Sociais */}
      <div className={styles.socials}>
        <div className={styles.socialIcons}>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSpotify} size="2x" />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} size="2x" />
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} size="2x" />
          </a>
        </div>
      </div>
    </footer>
  );
}
