<template>
  <div class="create-station">
    <!-- Loading state for edit mode -->
    <div v-if="isDataLoading" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner large"></div>
        <p class="loading-text">Loading station data...</p>
      </div>
    </div>

    <!-- Map Section -->
    <div v-else class="container">
      <div class="form-card">
        <h1 class="form-title">{{ isEditMode ? "Edit Charging Station" : "Create Charging Station" }}</h1>
        <p class="form-subtitle">
          {{ isEditMode ? "Update the charging station information" : "Add a new electric vehicle charging station to the network" }}
        </p>

        <form @submit.prevent="createStation" class="station-form">
          <div class="form-group">
            <label for="name" class="form-label">Station Name</label>
            <input type="text" id="name" v-model="form.name" class="form-input" placeholder="Enter station name" required />
          </div>

          <!-- Location Display -->
          <div class="form-group">
            <label class="form-label">Selected Location</label>
            <div v-if="form.location.latitude && form.location.longitude" class="location-display">
              <div class="location-info">
                <span class="location-icon">📍</span>
                <div class="location-text">
                  <span class="location-coords">{{ form.location.latitude.toFixed(6) }}, {{ form.location.longitude.toFixed(6) }}</span>
                  <span class="location-hint">Coordinates selected from map</span>
                </div>
              </div>
            </div>
            <div v-else class="no-location">
              <span class="no-location-icon">🗺️</span>
              <span class="no-location-text">Please select a location on the map above</span>
            </div>
          </div>
          <StreetMap @coordinates-selected="onCoordinatesSelected" />

          <div class="form-group">
            <label for="type" class="form-label">Charger Type</label>
            <select id="type" v-model="form.connectorType" class="form-select" required>
              <option value="">Select charger type</option>
              <option v-for="type in chargerTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="power" class="form-label">Power Output (kW)</label>
            <input type="number" id="power" v-model="form.powerOutput" class="form-input" placeholder="Enter power output" min="1" required />
          </div>
          <div class="form-group">
            <label for="status" class="form-label">Status</label>
            <select id="status" v-model="form.status" class="form-select" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="isEditMode"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            {{ isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Station" : "Create Station" }}
          </button>

          <button v-if="isEditMode" type="button" @click="cancelEdit" class="cancel-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChargerService from "@/services/charger-service";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue-sonner";
import StreetMap from "./StreetMap.vue";

interface ChargingStation {
  _id?: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  connectorType: string;
  powerOutput: number;
  status: string;
}

const router = useRouter();
const route = useRoute();
const chargerTypes = ["Type 1", "Type 2", "CCS", "CHAdeMO", "Tesla Supercharger"];

// Check if we're in edit mode based on route params
const isEditMode = computed(() => !!route.params.id);
const stationId = computed(() => route.params.id as string);

const form = ref<ChargingStation>({
  name: "",
  location: {
    latitude: 0,
    longitude: 0,
  },
  connectorType: "",
  powerOutput: 0,
  status: "Inactive",
});

const originalData = ref<ChargingStation | null>(null);
const isLoading = ref(false);
const isDataLoading = ref(false);

// Watch for route changes to handle navigation between create and edit
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadStationData(newId as string);
    } else {
      formReset();
    }
  },
  { immediate: true }
);

const formReset = () => {
  form.value = {
    name: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
    connectorType: "",
    powerOutput: 0,
    status: "Inactive",
  };
  originalData.value = null;
};

const loadStationData = async (id: string) => {
  if (!id) return;

  isDataLoading.value = true;
  try {
    const response = await ChargerService.getChargerById(id);
    const station = response.data || response;

    form.value = {
      _id: station._id,
      name: station.name,
      location: {
        latitude: station.location.latitude,
        longitude: station.location.longitude,
      },
      connectorType: station.connectorType,
      powerOutput: station.powerOutput,
      status: station.status,
    };

    // Store original data for comparison
    originalData.value = { ...form.value };
  } catch (error: any) {
    console.error("Error loading station data:", error);
    toast.error("Failed to load station data");
    router.push("/");
  } finally {
    isDataLoading.value = false;
  }
};

const onCoordinatesSelected = (coordinates: { lat: number; lng: number } | null) => {
  if (coordinates) {
    form.value.location.latitude = coordinates.lat;
    form.value.location.longitude = coordinates.lng;
  } else {
    form.value.location.latitude = 0;
    form.value.location.longitude = 0;
  }
};

const hasChanges = computed(() => {
  if (!isEditMode.value || !originalData.value) return true;

  return JSON.stringify(form.value) !== JSON.stringify(originalData.value);
});

const createStation = async () => {
  if (!form.value.location.latitude || !form.value.location.longitude) {
    toast.error("Please select a location on the map");
    return;
  }

  isLoading.value = true;
  try {
    if (isEditMode.value && stationId.value) {
      // Update existing station
      await ChargerService.updateChargerById(stationId.value, form.value);
      toast.success("Station updated successfully!");
    } else {
      // Create new station
      await ChargerService.createCharger(form.value);
      toast.success("Station created successfully!");
    }

    router.push("/");
  } catch (error: any) {
    console.error(`Error ${isEditMode.value ? "updating" : "creating"} station:`, error);
    toast.error(error.response?.data?.message || `Failed to ${isEditMode.value ? "update" : "create"} station`);
  } finally {
    isLoading.value = false;
  }
};

const cancelEdit = () => {
  if (hasChanges.value) {
    if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      router.push("/");
    }
  } else {
    router.push("/");
  }
};

// Load data on component mount if in edit mode
onMounted(() => {
  if (isEditMode.value && stationId.value) {
    loadStationData(stationId.value);
  }
});
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

/* Location Display Styles */
.location-display {
  background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
  border: 2px solid #38b2ac;
  border-radius: 12px;
  padding: 1rem;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.location-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.location-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-coords {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.location-hint {
  font-size: 0.8rem;
  color: #38b2ac;
  font-weight: 500;
}

.no-location {
  background: linear-gradient(135deg, #fef5e7 0%, #fff5f5 100%);
  border: 2px dashed #ed8936;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #c05621;
}

.no-location-icon {
  font-size: 1.5rem;
  opacity: 0.7;
}

.no-location-text {
  font-weight: 500;
  font-size: 0.95rem;
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

.cancel-btn {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 50px;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(160, 174, 192, 0.3);
  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
}

.cancel-btn:active {
  transform: translateY(0);
}

.loading-container {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.loading-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-text {
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 1rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top: 3px solid #667eea;
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

  .cancel-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  .loading-content {
    padding: 2rem 1.5rem;
  }
}
</style>
