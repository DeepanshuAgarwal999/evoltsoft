<template>
  <div v-if="loading" class="loading-container">
    <Loader />
  </div>
  <div v-else class="home-container relative">
    <!-- No data at all (no stations exist) -->
    <div v-if="!data || (data.length === 0 && !hasActiveFilters)" class="no-data-container">
      <div class="no-data-content">
        <div class="no-data-icon">🔌</div>
        <h1 class="no-data-title">No Charging Stations Available</h1>
        <p class="no-data-subtitle">Start by creating your first charging station!</p>
        <router-link to="/create-station" class="create-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create Station
        </router-link>
      </div>
    </div>
    <!-- Has stations but showing filter interface -->
    <div v-else>
      <!-- Left Sidebar with Filters -->
      <div class="stations-header">
        <h1 class="stations-title">⚡ Charging Stations</h1>
        <p class="stations-subtitle">Manage your charging infrastructure</p>
        <div class="stations-stats">
          <div class="stat-card">
            <span class="stat-number">{{ data.length }}</span>
            <span class="stat-label">{{ hasActiveFilters ? "Found" : "Total" }} Stations</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ activeStations }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ totalPower }}kW</span>
            <span class="stat-label">Total Power</span>
          </div>
        </div>
      </div>
      <div class="stations-layout">
        <div class="sidebar">
          <div class="sidebar-header">
            <h2 class="sidebar-title">🔍 Filters</h2>
            <p class="sidebar-subtitle">Filter your stations</p>
          </div>
          <FilterChargerStation @filtersChanged="handleFiltersChanged" />
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
          <!-- No data found by filters -->
          <div v-if="data.length === 0 && hasActiveFilters" class="no-results-container">
            <div class="no-results-content">
              <div class="no-results-icon">🔍</div>
              <h2 class="no-results-title">No Stations Match Your Filters</h2>
              <p class="no-results-subtitle">Try adjusting your search criteria or clear the filters to see all stations.</p>
              <div class="no-results-suggestions">
                <p class="suggestions-title">Suggestions:</p>
                <ul class="suggestions-list">
                  <li>✨ Clear all filters to see all stations</li>
                  <li>🔧 Try different power output values</li>
                  <li>📍 Check different connector types</li>
                  <li>🔤 Verify the station name spelling</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Stations grid (when data exists) -->
          <div v-else class="stations-grid">
            <ChargerStationCard
              v-for="station in data"
              :key="station._id"
              :station="station"
              @show-on-map="handleShowOnMap"
              @delete-station="handleDeleteStation"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Loader from "./shared/Loader.vue";
import ChargerService from "@/services/charger-service";
import ChargerStationCard from "./ChargerStationCard.vue";
import FilterChargerStation from "./FilterChargerStation.vue";
import Button from "./shared/Button.vue";

const data = ref(null);
const loading = ref(true);
const error = ref(null);
const currentFilters = ref({});
const hasActiveFilters = ref(false);

// Computed properties for statistics
const activeStations = computed(() => {
  if (!data.value) return 0;
  return data.value.filter((station) => station.status.toLowerCase() === "active").length;
});

const totalPower = computed(() => {
  if (!data.value) return 0;
  return data.value.reduce((sum, station) => sum + station.powerOutput, 0);
});

const fetchData = async (filters = {}) => {
  try {
    loading.value = true;

    // Clean up filters - remove empty values
    const cleanFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].trim() !== "") {
        cleanFilters[key] = filters[key];
      }
    });
    const response = await ChargerService.getAllChargers(cleanFilters);

    // Handle different response structures
    if (response.success && response.data) {
      data.value = response.data; // New format
    } else if (Array.isArray(response.data)) {
      data.value = response.data; // Old format with data property
    } else if (Array.isArray(response)) {
      data.value = response;
    } else {
      data.value = [];
    }

    console.log("Data set to:", data.value);
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching chargers:", err);
    data.value = [];
  } finally {
    loading.value = false;
  }
};

const handleDeleteStation = async (station) => {
  if (confirm(`Are you sure you want to delete "${station.name}"?`)) {
    try {
      await ChargerService.deleteCharger(station._id);
      // Refetch data with current filters
      await fetchData(currentFilters.value);
    } catch (err) {
      console.error("Error deleting station:", err);
      alert("Error deleting station. Please try again.");
    }
  }
};

const handleShowOnMap = (station) => {
  // Navigate to map with coordinates
  const { latitude, longitude } = station.location;
  window.open(`/map/${latitude}/${longitude}`, "_blank");
};

// Handle filter changes from FilterChargerStation component
const handleFiltersChanged = async (filters) => {
  // Check if any filters are active
  hasActiveFilters.value = Object.values(filters).some((value) => value !== "");

  // Only update if filters actually changed
  const filtersChanged = JSON.stringify(currentFilters.value) !== JSON.stringify(filters);

  if (filtersChanged) {
    currentFilters.value = { ...filters };
    await fetchData(filters);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.loading-container {
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* No Data State */
.no-data-container {
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.no-data-content {
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: block;
}

.no-data-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.no-data-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* Stations Layout - Sidebar + Main Content */
.stations-layout {
  display: flex;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 140px);
}

/* Sidebar Styles */
.sidebar {
  width: 360px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  margin-top: 2rem;
  position: sticky;
  top: 6rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.sidebar-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-subtitle {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

/* Main Content Area */
.main-content {
  flex: 1;
  min-width: 0; /* Allow flex item to shrink */
}

/* Stations Container (now for main content) */
.stations-container {
  max-width: 1400px;
  margin: 0 auto;
}

.stations-header {
  text-align: center;
  margin-bottom: 3rem;
}

.stations-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stations-subtitle {
  color: #718096;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.stations-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 140px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stations Grid */
.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stations-layout {
    gap: 1.5rem;
  }

  .sidebar {
    width: 280px;
  }

  .stations-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .stations-layout {
    flex-direction: column;
    gap: 2rem;
  }

  .sidebar {
    width: 100%;
    position: static;
    top: auto;
  }

  .sidebar-header {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .stations-title {
    font-size: 2.5rem;
  }

  .stations-subtitle {
    font-size: 1rem;
  }

  .stations-stats {
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem 1.5rem;
    min-width: 120px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stations-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .no-data-content {
    padding: 2rem 1.5rem;
  }

  .no-data-title {
    font-size: 1.75rem;
  }

  .no-data-subtitle {
    font-size: 1rem;
  }

  .stations-layout {
    gap: 1.5rem;
  }

  .sidebar {
    padding: 1rem;
  }

  .sidebar-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .stations-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-card {
    width: 100%;
    max-width: 200px;
  }

  .stations-layout {
    gap: 1rem;
  }
}

/* Animation for grid items */
.stations-grid > * {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.stations-grid > *:nth-child(1) {
  animation-delay: 0.1s;
}
.stations-grid > *:nth-child(2) {
  animation-delay: 0.2s;
}
.stations-grid > *:nth-child(3) {
  animation-delay: 0.3s;
}
.stations-grid > *:nth-child(4) {
  animation-delay: 0.4s;
}
.stations-grid > *:nth-child(5) {
  animation-delay: 0.5s;
}
.stations-grid > *:nth-child(6) {
  animation-delay: 0.6s;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* No Results Styles */
.no-results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  margin: 2rem 0;
}

.no-results-content {
  text-align: center;
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 600px;
  width: 100%;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.no-results-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.no-results-subtitle {
  font-size: 1.125rem;
  color: #718096;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.no-results-suggestions {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.suggestions-title {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  color: #718096;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.suggestions-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .no-results-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .no-results-title {
    font-size: 1.75rem;
  }

  .no-results-subtitle {
    font-size: 1rem;
  }

  .no-results-icon {
    font-size: 3rem;
  }
}
</style>
