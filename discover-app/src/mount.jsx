import { createRoot } from "react-dom/client";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);

// Makes the site installable as an app (PWA)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
