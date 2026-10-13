<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  loader: { type: Function, required: true },
  label: { type: String, required: true },
});

const root = ref(null);
const error = ref("");
let unmountRemote;
let alive = true;

function resolveMount(mod) {
  if (typeof mod.mount === "function") return mod.mount;
  if (typeof mod.default === "function") return mod.default;
  if (typeof mod.default?.mount === "function") return mod.default.mount;
  throw new Error("Remote did not expose mount()");
}

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

onUnmounted(() => {
  alive = false;
  unmountRemote?.();
});
</script>

<template>
  <p v-if="error" class="remote-error">{{ error }}</p>
  <div ref="root" v-once></div>
</template>
