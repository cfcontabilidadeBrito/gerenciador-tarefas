import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Header.module.css";

export default function Header({ isAuthenticated, userName, handleLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/img/logo.png" // Certifique-se de que a imagem está na pasta 'public'
            alt="Logo CF Contabilidade"
            width={180} // Ajuste conforme necessário
            height={100} // Ajuste conforme necessário
          />
        </Link>
      </div>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/login">
              <button className={styles.authButton}>Login</button>
            </Link>
            <Link href="/cadastro">
              <button className={styles.authButton}>Cadastro</button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
