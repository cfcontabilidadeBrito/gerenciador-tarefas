import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import TaskList from "../components/TaskList";
import TaskStatus from "../components/TaskStatus";

export default function Home() {
  const router = useRouter();

  // 🔐 Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // 🧠 Estado das tarefas
  const [tasks, setTasks] = useState([]);

  // 🎯 Verifica se usuário está autenticado
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));

        const response = await fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        const data = await response.json();
        setTasks(data);
      }
    };

    fetchUserAndTasks();
  }, []);

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} user={user} />

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {!isAuthenticated ? (
            <div className={styles.welcome}>
              <h1 className={styles.textoM}>Sistema de Gerenciamento de Tarefas CF Contabilidade</h1>
              <h2 className={styles.textoP}>
                Olá, seja bem-vindo(a) ao nosso sistema de gerenciamento de tarefas. Para acessar o conteúdo, faça login.
              </h2>
              <button className={styles.startButton} onClick={() => router.push("/cadastro")}>
                Começar agora
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Bem-vindo(a), {user?.name}!
              </h2>
              <div className={styles.taskArea}>
                <TaskList tasks={tasks} setTasks={setTasks} />
                <TaskStatus tasks={tasks} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
