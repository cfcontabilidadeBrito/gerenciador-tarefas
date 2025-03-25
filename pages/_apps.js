import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
