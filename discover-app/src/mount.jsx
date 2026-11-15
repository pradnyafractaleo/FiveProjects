import { createRoot } from "react-dom/client";
// Hand-drawn font, bundled with the app (Patrick Hand, SIL Open Font License)
import "@fontsource/patrick-hand/latin-400.css";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);

// Makes the site installable as an app (PWA)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
