<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import RemoteView from "./RemoteView.vue";

// Every path except /calculator is the home page.
const path = ref(location.pathname === "/calculator" ? "/calculator" : "/");

const loadCalculator = () => import("calculator/mount");
const loadNews = () => import("news/mount");
const loadCurrency = () => import("currency/mount");

// Change the page without reloading the document.
function go(next) {
  if (next === path.value) return;
  history.pushState(null, "", next);
  path.value = next;
}

// Keep the page in sync when the user uses the browser back button.
function onPopState() {
  path.value = location.pathname === "/calculator" ? "/calculator" : "/";
}
onMounted(() => window.addEventListener("popstate", onPopState));
onUnmounted(() => window.removeEventListener("popstate", onPopState));
</script>

<template>
  <div class="shell">
    <header class="header">
      <p class="brand">Microfrontends</p>
      <nav class="nav">
        <a href="/" :class="{ active: path === '/' }" @click.prevent="go('/')">Home</a>
        <a
          href="/calculator"
          :class="{ active: path === '/calculator' }"
          @click.prevent="go('/calculator')"
        >
          Calculator
        </a>
      </nav>
    </header>

    <main id="content">
      <RemoteView
        v-if="path === '/calculator'"
        label="Calculator"
        :loader="loadCalculator"
      />
      <div v-else class="stack">
        <RemoteView label="News" :loader="loadNews" />
        <RemoteView label="Currency converter" :loader="loadCurrency" />
      </div>
    </main>

    <footer class="footer">
      <p>Host shell</p>
    </footer>
  </div>
</template>
