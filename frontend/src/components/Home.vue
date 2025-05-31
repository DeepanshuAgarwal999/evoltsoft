<template>
  <div v-if="loading">
    <Loader />
  </div>
  <div v-else>
    <div v-if="!data" class="flex justify-center items-center h-[calc(100vh-76px)] text-center">
      <h1 class="text-4xl font-bold text-gray-800">No Charger Station Available.</h1>
    </div>
    <div v-else></div>
  </div>
  <!-- <Loader /> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import Loader from "./shared/Loader.vue";
import ChargerService from "@/services/charger-service";
const data = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await ChargerService.getAllChargers();
    console.log(response);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
