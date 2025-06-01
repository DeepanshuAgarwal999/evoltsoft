<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/shared/Navbar.vue";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <div id="app">
    <Toaster position="top-right" rich-colors />
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
</style>
