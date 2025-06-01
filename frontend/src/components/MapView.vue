<template>
  <div class="map-container">
    <div class="map-header">
      <h2 class="text-2xl font-bold mb-4">
        {{ showingAllChargers ? "All Charging Stations" : "Map View" }}
      </h2>
      <div v-if="coordinates.lat && coordinates.lng && !showingAllChargers" class="coordinates-info mb-4">
        <p class="text-sm text-gray-600">Latitude: {{ coordinates.lat }}, Longitude: {{ coordinates.lng }}</p>
      </div>
      <div v-if="showingAllChargers" class="chargers-info mb-4">
        <p class="text-sm text-gray-600">Showing {{ chargers.length }} charging station{{ chargers.length !== 1 ? "s" : "" }} on the map</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="text-sm text-gray-600 mt-2">Loading charging stations...</p>
    </div>

    <div
      ref="mapContainer"
      id="map"
      class="map-element"
      style="height: 500px; width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    ></div>

    <div v-if="error" class="error-message mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Charger Details Modal -->
    <div v-if="selectedCharger" class="modal-overlay" @click="closeChargerDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedCharger.name }}</h3>
          <button @click="closeChargerDetails" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="charger-details">
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value" :class="getStatusClass(selectedCharger.status)">
                {{ selectedCharger.status }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Power Output:</span>
              <span class="detail-value">{{ selectedCharger.powerOutput }} kW</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Connector Type:</span>
              <span class="detail-value">{{ selectedCharger.connectorType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">
                {{ selectedCharger.location.latitude.toFixed(6) }}, {{ selectedCharger.location.longitude.toFixed(6) }}
              </span>
            </div>
            <div v-if="selectedCharger.description" class="detail-row">
              <span class="detail-label">Description:</span>
              <span class="detail-value">{{ selectedCharger.description }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="viewOnMap" class="btn-primary">Center on Map</button>
            <button @click="closeChargerDetails" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import L from "leaflet";
import ChargerService from "@/services/charger-service";

// Fix for default markers in Leaflet with Vite
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const route = useRoute();
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const markers = ref([]);
const error = ref("");
const loading = ref(false);
const chargers = ref([]);
const selectedCharger = ref(null);
const showingAllChargers = ref(false);

// Reactive coordinates
const coordinates = ref({
  lat: null,
  lng: null,
});

// Default coordinates (Berlin, Germany)
const defaultCoordinates = {
  lat: 52.52,
  lng: 13.405,
};

// Create custom icons for different charger statuses
const createChargerIcon = (status) => {
  const color = status === "Active" ? "#10b981" : "#ef4444"; // green for active, red for inactive

  return L.divIcon({
    className: "custom-charger-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ⚡
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Fetch all chargers
const fetchAllChargers = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await ChargerService.getAllChargers();

    // Handle different response formats
    if (response.success && response.data) {
      chargers.value = response.data;
    } else if (Array.isArray(response)) {
      chargers.value = response;
    } else if (response.data && Array.isArray(response.data)) {
      chargers.value = response.data;
    } else {
      chargers.value = [];
    }

    console.log("Fetched chargers:", chargers.value);

    if (chargers.value.length === 0) {
      error.value = "No charging stations found";
    }
  } catch (err) {
    console.error("Error fetching chargers:", err);
    error.value = "Failed to load charging stations";
    chargers.value = [];
  } finally {
    loading.value = false;
  }
};

// Extract coordinates from route params or query
const extractCoordinates = () => {
  try {
    // Check query params
    const lat = route.query.latitude;
    const lng = route.query.longitude;

    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        throw new Error("Invalid coordinate format in query params");
      }

      if (parsedLat < -90 || parsedLat > 90) {
        throw new Error("Latitude must be between -90 and 90");
      }

      if (parsedLng < -180 || parsedLng > 180) {
        throw new Error("Longitude must be between -180 and 180");
      }

      coordinates.value = {
        lat: parsedLat,
        lng: parsedLng,
      };
      showingAllChargers.value = false;
      error.value = "";
    } else {
      // No specific coordinates provided, show all chargers
      showingAllChargers.value = true;
      coordinates.value = { ...defaultCoordinates };
      fetchAllChargers();
    }
  } catch (err) {
    error.value = `Error parsing coordinates: ${err.message}`;
    coordinates.value = { ...defaultCoordinates };
    showingAllChargers.value = true;
    fetchAllChargers();
  }
};

// Initialize the map
const initMap = () => {
  if (!mapContainer.value) return;

  // Create map instance
  map.value = L.map(mapContainer.value).setView([coordinates.value.lat, coordinates.value.lng], 13);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  // Add markers based on mode
  if (showingAllChargers.value) {
    addChargerMarkers();
  } else {
    addSingleMarker();
  }
};

// Add markers for all chargers
const addChargerMarkers = () => {
  if (!map.value || chargers.value.length === 0) return;

  // Clear existing markers
  clearMarkers();

  const bounds = [];

  chargers.value.forEach((charger) => {
    if (charger.location && charger.location.latitude && charger.location.longitude) {
      const lat = charger.location.latitude;
      const lng = charger.location.longitude;

      bounds.push([lat, lng]);

      const marker = L.marker([lat, lng], {
        icon: createChargerIcon(charger.status),
      })
        .addTo(map.value)
        .bindPopup(createChargerPopupContent(charger))
        .on("click", () => {
          selectedCharger.value = charger;
        });

      markers.value.push(marker);
    }
  });

  // Fit map to show all markers
  if (bounds.length > 0) {
    if (bounds.length === 1) {
      map.value.setView(bounds[0], 13);
    } else {
      map.value.fitBounds(bounds, { padding: [20, 20] });
    }
  }
};

// Create popup content for charger
const createChargerPopupContent = (charger) => {
  return `
    <div class="charger-popup">
      <div class="popup-header">
        <strong>${charger.name}</strong>
        <span class="popup-status ${charger.status.toLowerCase()}">${charger.status}</span>
      </div>
      <div class="popup-details">
        <div class="popup-row">
          <span class="popup-label">Power:</span>
          <span class="popup-value">${charger.powerOutput} kW</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Type:</span>
          <span class="popup-value">${charger.connectorType}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Location:</span>
          <span class="popup-value">${charger.location.latitude.toFixed(4)}, ${charger.location.longitude.toFixed(4)}</span>
        </div>
      </div>
      <button class="popup-button" onclick="this.closest('.leaflet-popup').dispatchEvent(new CustomEvent('charger-details', { detail: '${
        charger._id
      }' }))">
        View Details
      </button>
    </div>
  `;
};

// Add or update single marker
const addSingleMarker = () => {
  if (!map.value) return;

  // Remove existing marker
  if (marker.value) {
    map.value.removeLayer(marker.value);
  }

  // Add new marker
  marker.value = L.marker([coordinates.value.lat, coordinates.value.lng])
    .addTo(map.value)
    .bindPopup(
      `
      <div class="popup-content">
        <strong>Location</strong><br>
        Lat: ${coordinates.value.lat}<br>
        Lng: ${coordinates.value.lng}
      </div>
    `
    )
    .openPopup();

  // Center map on marker
  map.value.setView([coordinates.value.lat, coordinates.value.lng], 13);
};

// Clear all markers
const clearMarkers = () => {
  markers.value.forEach((marker) => {
    if (map.value && marker) {
      map.value.removeLayer(marker);
    }
  });
  markers.value = [];

  if (marker.value && map.value) {
    map.value.removeLayer(marker.value);
    marker.value = null;
  }
};

// Update map when coordinates or chargers change
const updateMap = () => {
  if (map.value) {
    if (showingAllChargers.value) {
      addChargerMarkers();
    } else if (coordinates.value.lat && coordinates.value.lng) {
      addSingleMarker();
    }
  }
};

// Modal functions
const closeChargerDetails = () => {
  selectedCharger.value = null;
};

const viewOnMap = () => {
  if (selectedCharger.value && map.value) {
    const lat = selectedCharger.value.location.latitude;
    const lng = selectedCharger.value.location.longitude;
    map.value.setView([lat, lng], 16);
  }
};

const getStatusClass = (status) => {
  return status === "Active" ? "status-active" : "status-inactive";
};

watch(
  () => route.query,
  () => {
    extractCoordinates();
    updateMap();
  },
  { deep: true }
);

// Watch for chargers changes
watch(
  () => chargers.value,
  () => {
    if (showingAllChargers.value) {
      updateMap();
    }
  },
  { deep: true }
);

onMounted(() => {
  extractCoordinates();
  initMap();

  // Listen for popup events
  document.addEventListener("charger-details", (event) => {
    const chargerId = event.detail;
    const charger = chargers.value.find((c) => c._id === chargerId);
    if (charger) {
      selectedCharger.value = charger;
    }
  });
});

onUnmounted(() => {
  if (map.value) {
    clearMarkers();
    map.value.remove();
  }

  // Remove event listener
  document.removeEventListener("charger-details", () => {});
});
</script>

<style scoped>
.map-container {
  padding: 20px;
  max-width: 100%;
}

.map-header {
  margin-bottom: 16px;
}

.coordinates-info,
.chargers-info {
  background-color: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.map-element {
  z-index: 1;
}

.error-message {
  font-size: 14px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.charger-details {
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #374151;
}

.detail-value {
  color: #111827;
  font-weight: 600;
}

.detail-value.status-active {
  color: #10b981;
}

.detail-value.status-inactive {
  color: #ef4444;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Override Leaflet popup styles */
:global(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
  min-width: 200px;
}

:global(.popup-content) {
  font-size: 14px;
}

/* Custom popup styles */
:global(.charger-popup) {
  font-family: system-ui, -apple-system, sans-serif;
}

:global(.popup-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

:global(.popup-status) {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

:global(.popup-status.active) {
  background: #dcfce7;
  color: #166534;
}

:global(.popup-status.inactive) {
  background: #fee2e2;
  color: #991b1b;
}

:global(.popup-details) {
  margin-bottom: 12px;
}

:global(.popup-row) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

:global(.popup-label) {
  font-weight: 500;
  color: #6b7280;
  font-size: 12px;
}

:global(.popup-value) {
  font-weight: 600;
  color: #111827;
  font-size: 12px;
}

:global(.popup-button) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}

:global(.popup-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

/* Custom marker styles */
:global(.custom-charger-marker) {
  background: transparent;
  border: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .map-container {
    padding: 16px;
  }

  .modal-content {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
