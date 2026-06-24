import { createRoot } from "react-dom/client";
import { LandingPage } from "../landing/LandingPage";
import { StudioApp } from "./app/StudioApp";
import "./design-system/tokens.css";

const root = document.getElementById("root");
if (root) {
  const path = window.location.pathname.replace(import.meta.env.BASE_URL, "/");
  createRoot(root).render(path.startsWith("/studio") ? <StudioApp /> : <LandingPage />);
}
