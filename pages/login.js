import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Se já estiver logado, redireciona para a home
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          action: "login"
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro no servidor");
    }
  };

  return (
    <div className={styles.pageWrapper}>
    <Header isAuthenticated={false} />
    <div className={styles.loginContent}>
      <div className={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Entrar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Ainda não tem uma conta?{" "}
          <span className={styles.span} onClick={() => router.push("/cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </div>
    <Footer />
  </div>
  );
}
