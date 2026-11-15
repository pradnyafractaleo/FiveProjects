import { createRoot } from "react-dom/client";
// Hand-drawn fonts, bundled with the app (SIL Open Font License): Patrick Hand for text, Caveat Brush for titles
import "@fontsource/patrick-hand/latin-400.css";
import "@fontsource/caveat-brush/latin-400.css";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);

// Makes the site installable as an app (PWA)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
