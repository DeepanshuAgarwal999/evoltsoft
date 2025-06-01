<template>
  <div class="map-container">
    <div class="map-header">
      <h3 class="map-title">📍 Select Location on Map</h3>
      <p class="map-subtitle">Click on the map to select coordinates for your charging station</p>
    </div>
    <div class="map-wrapper">
      <div :id="mapId" class="map"></div>
      <div v-if="selectedCoordinates" class="coordinates-display">
        <div class="coordinates-info">
          <span class="coordinate-label">Selected Location:</span>
          <span class="coordinate-value">{{ selectedCoordinates.lat.toFixed(6) }}, {{ selectedCoordinates.lng.toFixed(6) }}</span>
        </div>
        <button @click="clearSelection" class="clear-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, defineEmits } from "vue";
import L from "leaflet";

// Generate unique ID for each map instance
const mapId = ref(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
const selectedCoordinates = ref(null);
const mapInstance = ref(null);
const currentMarker = ref(null);

const emit = defineEmits(["coordinates-selected"]);

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const initializeMap = () => {
  try {
    // Check if map container exists before initialization
    const mapContainer = document.getElementById(mapId.value);
    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }

    // Remove any existing map instance
    if (mapInstance.value) {
      mapInstance.value.remove();
      mapInstance.value = null;
    }

    // Create new map instance
    mapInstance.value = L.map(mapId.value, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView([28.6139, 77.209], 10); // Default to Delhi

    // Add tile layer with better styling
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
    }).addTo(mapInstance.value);

    // Handle map clicks
    mapInstance.value.on("click", (event) => {
      const { lat, lng } = event.latlng;

      // Remove existing marker
      if (currentMarker.value) {
        mapInstance.value.removeLayer(currentMarker.value);
      }

      // Add new marker
      currentMarker.value = L.marker([lat, lng], {
        draggable: true,
      }).addTo(mapInstance.value);

      // Update coordinates
      selectedCoordinates.value = { lat, lng };

      // Emit coordinates to parent component
      emit("coordinates-selected", { lat, lng });

      // Make marker draggable and update coordinates on drag
      currentMarker.value.on("dragend", (dragEvent) => {
        const newPos = dragEvent.target.getLatLng();
        selectedCoordinates.value = { lat: newPos.lat, lng: newPos.lng };
        emit("coordinates-selected", { lat: newPos.lat, lng: newPos.lng });
      });
    });

    // Add some initial styling to the map
    mapInstance.value.on("load", () => {
      console.log("Map loaded successfully");
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
};

const clearSelection = () => {
  if (currentMarker.value && mapInstance.value) {
    mapInstance.value.removeLayer(currentMarker.value);
    currentMarker.value = null;
  }
  selectedCoordinates.value = null;
  emit("coordinates-selected", null);
};

onMounted(() => {
  // Use setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    initializeMap();
  }, 100);
});

onUnmounted(() => {
  // Clean up map instance to prevent memory leaks
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
  }
  if (currentMarker.value) {
    currentMarker.value = null;
  }
});
</script>

<style scoped>
.map-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.map-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.map-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.map-subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.map-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  z-index: 1;
}

.coordinates-display {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.coordinates-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coordinate-label {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coordinate-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.clear-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  min-height: 32px;
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  background: linear-gradient(135deg, #ff5252, #d63031);
}

.clear-btn:active {
  transform: translateY(0);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .map-container {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .map {
    height: 300px;
  }

  .map-title {
    font-size: 1.25rem;
  }

  .map-subtitle {
    font-size: 0.875rem;
  }

  .coordinates-display {
    position: static;
    margin-top: 1rem;
    justify-content: space-between;
  }

  .coordinate-value {
    font-size: 0.8rem;
  }
}

/* Animation for marker placement */
@keyframes markerDrop {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Leaflet overrides for better styling */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

:deep(.leaflet-control-zoom a) {
  background: white !important;
  color: #4a5568 !important;
  border: none !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #f7fafc !important;
  color: #2d3748 !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

:deep(.leaflet-popup-tip) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}
</style>
