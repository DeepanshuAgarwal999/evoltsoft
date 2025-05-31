<template>
  <div class="create-station">
    <div class="container">
      <div class="form-card">
        <h1 class="form-title">Create Charging Station</h1>
        <p class="form-subtitle">Add a new electric vehicle charging station to the network</p>

        <form @submit.prevent="createStation" class="station-form">
          <div class="form-group">
            <label for="name" class="form-label">Station Name</label>
            <input type="text" id="name" v-model="form.name" class="form-input" placeholder="Enter station name" required />
          </div>

          <div class="form-group">
            <label for="location" class="form-label">Location</label>
            <input type="text" id="location" v-model="form.location" class="form-input" placeholder="Enter station location" required />
          </div>

          <div class="form-group">
            <label for="type" class="form-label">Charger Type</label>
            <select id="type" v-model="form.type" class="form-select" required>
              <option value="">Select charger type</option>
              <option value="level1">Level 1 (120V)</option>
              <option value="level2">Level 2 (240V)</option>
              <option value="dcfast">DC Fast Charging</option>
            </select>
          </div>

          <div class="form-group">
            <label for="power" class="form-label">Power Output (kW)</label>
            <input type="number" id="power" v-model="form.power" class="form-input" placeholder="Enter power output" min="1" required />
          </div>

          <div class="form-group">
            <label for="price" class="form-label">Price per kWh ($)</label>
            <input type="number" id="price" v-model="form.price" class="form-input" placeholder="Enter price per kWh" step="0.01" min="0" required />
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea id="description" v-model="form.description" class="form-textarea" placeholder="Enter station description" rows="4"></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? "Creating..." : "Create Station" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  name: "",
  location: "",
  type: "",
  power: "",
  price: "",
  description: "",
});

const isLoading = ref(false);

const createStation = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Creating station:", form.value);

    // Reset form
    form.value = {
      name: "",
      location: "",
      type: "",
      power: "",
      price: "",
      description: "",
    };

    // Show success message or redirect
    alert("Station created successfully!");
    router.push("/");
  } catch (error) {
    console.error("Error creating station:", error);
    alert("Error creating station. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.create-station {
  min-height: calc(100vh - 70px);
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-subtitle {
  color: #718096;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

.station-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.form-select {
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 50px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .create-station {
    padding: 1rem;
  }

  .form-card {
    padding: 2rem 1.5rem;
    margin: 1rem 0;
  }

  .form-title {
    font-size: 2rem;
  }

  .form-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .station-form {
    gap: 1.25rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  .submit-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
