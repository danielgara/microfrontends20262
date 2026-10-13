import "./style.css";

const content = document.querySelector("#content");
let cleanups = [];
let renderId = 0;

function currentPath() {
  return location.pathname === "/calculator" ? "/calculator" : "/";
}

function setActiveLink() {
  const path = currentPath();
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === path);
  });
}

function cleanup() {
  cleanups.forEach((unmount) => unmount());
  cleanups = [];
  content.innerHTML = "";
}

function resolveMount(mod) {
  if (typeof mod.mount === "function") return mod.mount;
  if (typeof mod.default === "function") return mod.default;
  if (typeof mod.default?.mount === "function") return mod.default.mount;
  throw new Error("Remote did not expose mount()");
}

async function mountRemote(id, loader, elementId, label) {
  const el = document.getElementById(elementId);
  try {
    const mod = await loader();
    if (id !== renderId) return;
    const unmount = resolveMount(mod)(el);
    if (id !== renderId) {
      unmount?.();
      return;
    }
    if (typeof unmount === "function") cleanups.push(unmount);
  } catch (error) {
    console.error(error);
    if (id !== renderId || !el) return;
    el.innerHTML = `<p class="remote-error">${label} could not be loaded.</p>`;
  }
}

async function render() {
  const id = ++renderId;
  cleanup();
  setActiveLink();

  if (currentPath() === "/calculator") {
    content.innerHTML = '<div id="calculator-root"></div>';
    await mountRemote(id, () => import("calculator/mount"), "calculator-root", "Calculator");
    return;
  }

  content.innerHTML = `
    <div class="stack">
      <div id="news-root"></div>
      <div id="currency-root"></div>
    </div>
  `;

  await Promise.all([
    mountRemote(id, () => import("news/mount"), "news-root", "News"),
    mountRemote(id, () => import("currency/mount"), "currency-root", "Currency converter"),
  ]);
}

document.body.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");
  if (!link) return;
  event.preventDefault();
  const path = link.getAttribute("href");
  if (path === currentPath()) return;
  history.pushState(null, "", path);
  render();
});

window.addEventListener("popstate", render);
render();
