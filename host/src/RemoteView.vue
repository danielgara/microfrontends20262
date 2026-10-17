<script setup>
import { onMounted, onUnmounted, ref } from "vue";

// loader fetches the remote. label is shown if that fetch fails.
const props = defineProps({
  loader: { type: Function, required: true },
  label: { type: String, required: true },
});

const root = ref(null);
const error = ref("");
let unmountRemote;
let alive = true;

// Remotes may export mount as a named function or as the default export.
function resolveMount(mod) {
  if (typeof mod.mount === "function") return mod.mount;
  if (typeof mod.default === "function") return mod.default;
  if (typeof mod.default?.mount === "function") return mod.default.mount;
  throw new Error("Remote did not expose mount()");
}

// Load the remote and render it into this element.
onMounted(async () => {
  try {
    const mod = await props.loader();
    if (!alive) return;
    unmountRemote = resolveMount(mod)(root.value);
  } catch (err) {
    console.error(err);
    if (alive) error.value = `${props.label} could not be loaded.`;
  }
});

// Remove the remote when Vue destroys this component.
onUnmounted(() => {
  alive = false;
  unmountRemote?.();
});
</script>

<template>
  <p v-if="error" class="remote-error">{{ error }}</p>
  <div ref="root" v-once></div>
</template>
