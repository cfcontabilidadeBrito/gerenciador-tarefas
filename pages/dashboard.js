import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TaskList from "../components/TaskList";
import TaskStatus from "../components/TaskStatus";
import Sidebar from "../components/Sidebar"; // 
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!isClient || !user) return null;

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar /> {/* ✅ Sidebar adicionada aqui */}
      <div className={styles.dashboardContainer}>
        <h2 className={styles.title}>Bem-vindo(a), {user.name}!</h2>
        <div className={styles.taskArea}>
          <TaskList tasks={tasks} setTasks={setTasks} />
          <TaskStatus tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
