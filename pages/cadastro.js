import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Cadastro.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Cadastro() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, action: "register" }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Usuário cadastrado com sucesso!");
      router.push("/login");
    } else {
      alert(data.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header isAuthenticated={false} />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
            />
            <button className={styles.button} type="submit">
              Cadastrar
            </button>
          </form>
          <p>
            Já tem conta?{" "}
            <a className={styles.span} href="/login">
              Faça login
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
