import { createRoot } from "react-dom/client";
import { StudioApp } from "./app/StudioApp";
import "./design-system/tokens.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<StudioApp />);
}
