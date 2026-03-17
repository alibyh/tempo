import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const apiKey = import.meta.env.VITE_YANDEX_API_KEY ?? "";

function Root() {
  if (!apiKey) {
    return (
      <div style={{
        padding: "2rem",
        maxWidth: "520px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        color: "#c0caf5",
        background: "#1a1b26",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}>
        <h2 style={{ color: "#f7768e" }}>Yandex Maps: API key missing</h2>
        <p>Add <code style={{ background: "#24283b", padding: "2px 6px", borderRadius: "4px" }}>VITE_YANDEX_API_KEY</code> to <code style={{ background: "#24283b", padding: "2px 6px", borderRadius: "4px" }}>.env.local</code> (get a key from <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noreferrer" style={{ color: "#7aa2f7" }}>developer.tech.yandex.ru</a>).</p>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#a9b1d6" }}>
          If you see &quot;Invalid API key&quot;, edit the key in the dashboard and in <strong>HTTP Referer restrictions</strong> add:
        </p>
        <ul style={{ fontSize: "0.9rem", color: "#a9b1d6" }}>
          <li><code>http://localhost</code></li>
          <li><code>http://127.0.0.1</code></li>
        </ul>
        <p style={{ fontSize: "0.85rem", color: "#565f89" }}>Changes can take up to 15 minutes.</p>
      </div>
    );
  }

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
