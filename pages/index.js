import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.welcome}>
            <h1 className={styles.textoM}>Sistema de Gerenciamento de Tarefas CF Contabilidade</h1>
            <h2 className={styles.textoP}>
              Olá, seja bem-vindo(a) ao nosso sistema de gerenciamento de tarefas. Para acessar o conteúdo, faça login.
            </h2>
            <button className={styles.startButton} onClick={() => router.push("/cadastro")}>
              Começar agora
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
