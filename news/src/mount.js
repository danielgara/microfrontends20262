import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

export function mount(el) {
  const app = createApp(App);
  app.mount(el);
  return () => app.unmount();
}
