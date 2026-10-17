import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// The host calls this and uses the return value to remove the app later.
export function mount(el) {
  const app = createApp(App);
  app.mount(el);
  return () => app.unmount();
}

// Run on its own page. The host has no #app, so this stays idle there.
const standalone = document.querySelector("#app");
if (standalone) mount(standalone);
