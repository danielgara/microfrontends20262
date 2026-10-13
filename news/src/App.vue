<script setup>
import { news } from "./news.js";
</script>

<template>
  <section class="news">
    <h2>News</h2>
    <p class="tag">Vue</p>
    <ul>
      <li v-for="item in news" :key="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.summary }}</p>
      </li>
    </ul>
  </section>
</template>
