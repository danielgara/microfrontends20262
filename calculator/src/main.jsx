import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

export function mount(el) {
  const root = createRoot(el);
  root.render(<App />);
  return () => root.unmount();
}

const standalone = document.querySelector("#root");
if (standalone) mount(standalone);
