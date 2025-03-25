import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o token existe (autenticação simples)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main className="content" style={{ flexGrow: 1, padding: "20px" }}>
            <Component {...pageProps} />
          </main>
        </div>
      ) : (
        <>
          <Header />
          <main className="content">
            <Component {...pageProps} />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
