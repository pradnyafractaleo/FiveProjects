import { createRoot } from "react-dom/client";
import "./style.css";

export const mount = App => createRoot(document.getElementById("root")).render(<App />);
