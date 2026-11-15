import { createRoot } from "react-dom/client";
// Nunito font, bundled with the app (SIL Open Font License)
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-900.css";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);

// Makes the site installable as an app (PWA)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
