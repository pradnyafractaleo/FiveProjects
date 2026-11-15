import { createRoot } from "react-dom/client";
// Hand-drawn font, bundled with the app (Caveat, SIL Open Font License)
import "@fontsource/caveat/latin-400.css";
import "@fontsource/caveat/latin-700.css";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);

// Makes the site installable as an app (PWA)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
