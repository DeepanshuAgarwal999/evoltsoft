<template>
  <div class="map-container">
    <div class="map-header">
      <h2 class="text-2xl font-bold mb-4">Map View</h2>
      <div v-if="coordinates.lat && coordinates.lng" class="coordinates-info mb-4">
        <p class="text-sm text-gray-600">Latitude: {{ coordinates.lat }}, Longitude: {{ coordinates.lng }}</p>
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import L from "leaflet";

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
const error = ref("");

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

// Extract coordinates from route params or query
const extractCoordinates = () => {
  try {
    // Check query params
    const lat = route.query.latitude;
    const lng = route.query.longitude;
    console.log({ lat, lng });
    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      // Validate coordinates
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        throw new Error("Invalid coordinate format");
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
      error.value = "";
    } else {
      // Use default coordinates if none provided
      coordinates.value = { ...defaultCoordinates };
      error.value = "No coordinates provided, showing default location";
    }
  } catch (err) {
    error.value = `Error parsing coordinates: ${err.message}`;
    coordinates.value = { ...defaultCoordinates };
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

  // Add marker
  addMarker();
};

// Add or update marker
const addMarker = () => {
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

// Update map when coordinates change
const updateMap = () => {
  if (map.value && coordinates.value.lat && coordinates.value.lng) {
    addMarker();
  }
};

// Watch for route changes
watch(
  () => route.params,
  () => {
    extractCoordinates();
    updateMap();
  },
  { deep: true }
);

watch(
  () => route.query,
  () => {
    extractCoordinates();
    updateMap();
  },
  { deep: true }
);

onMounted(() => {
  extractCoordinates();
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
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

.coordinates-info {
  background-color: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.map-element {
  z-index: 1;
}

.error-message {
  font-size: 14px;
}

/* Override Leaflet popup styles */
:global(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
}

:global(.popup-content) {
  font-size: 14px;
}
</style>
