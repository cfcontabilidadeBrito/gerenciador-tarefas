// components/Sidebar.js
import styles from "../styles/Sidebar.module.css";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.sidebar}>
     <img src="/img/logo.png" alt="Logo CF" className={styles.logo} />
     <nav className={styles.nav}>
          <ul>
            <li>🏠 Home</li>
            <li>📊 Contexto Operacional</li>
            <li>📝 Tarefas</li>
            <li>📋 Dashboard</li>
          </ul>
        </nav>
      <div className={styles.logoutContainer}>
    <button className={styles.logoutButton} onClick={handleLogout}>
      Logout
    </button>
  </div>
    </div>
  );
}
