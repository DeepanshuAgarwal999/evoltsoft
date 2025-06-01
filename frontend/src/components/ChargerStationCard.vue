<template>
  <div class="charging-station-card">
    <!-- Card Header with Status Badge -->
    <div class="card-header">
      <div class="station-info">
        <h3 class="station-name">{{ station.name }}</h3>
        <div class="station-id">ID: {{ station._id.slice(-8).toUpperCase() }}</div>
      </div>
      <div class="status-badge" :class="statusClass">
        <div class="status-indicator"></div>
        {{ station.status }}
      </div>
    </div>

    <!-- Main Content -->
    <div class="card-content">
      <!-- Power and Connector Info -->
      <div class="power-section">
        <div class="power-display">
          <div class="power-icon">⚡</div>
          <div class="power-info">
            <span class="power-value">{{ station.powerOutput }}</span>
            <span class="power-unit">kW</span>
          </div>
        </div>
        <div class="connector-info">
          <div class="connector-type" :class="connectorClass">
            {{ station.connectorType }}
          </div>
        </div>
      </div>

      <!-- Location Info -->
      <div class="location-section">
        <div class="location-header">
          <div class="location-icon">📍</div>
          <span class="location-label">Location</span>
        </div>
        <div class="coordinates">
          <div class="coordinate">
            <span class="coord-label">Lat:</span>
            <span class="coord-value">{{ station.location.latitude.toFixed(6) }}</span>
          </div>
          <div class="coordinate">
            <span class="coord-label">Lng:</span>
            <span class="coord-value">{{ station.location.longitude.toFixed(6) }}</span>
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="timestamps">
        <div class="timestamp">
          <span class="timestamp-label">Created:</span>
          <span class="timestamp-value">{{ formatDate(station.createdAt) }}</span>
        </div>
        <div class="timestamp">
          <span class="timestamp-label">Updated:</span>
          <span class="timestamp-value">{{ formatDate(station.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="card-actions">
      <button class="action-btn primary text-nowrap" @click="editDetails">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          ></path>
        </svg>
        Edit Details
      </button>
      <button class="action-btn secondary" @click="showOnMap">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Map
      </button>
      <Button class="action-btn danger" v-if="isAuthenticated" @click="deleteStation">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
        Delete
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { computed, defineEmits } from "vue";
import { useRouter } from "vue-router";

interface ChargingStation {
  _id: string;
  name: string;
  powerOutput: number;
  connectorType: string;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Props {
  station: ChargingStation;
}

const props = defineProps<Props>();
const emit = defineEmits(["delete-station"]);
const router = useRouter();
const { isAuthenticated } = useAuth();

// Computed properties for styling
const statusClass = computed(() => {
  return {
    "status-active": props.station.status.toLowerCase() === "active",
    "status-inactive": props.station.status.toLowerCase() === "inactive",
    "status-maintenance": props.station.status.toLowerCase() === "maintenance",
  };
});

const connectorClass = computed(() => {
  return {
    "connector-ccs": props.station.connectorType === "CCS",
    "connector-chademo": props.station.connectorType === "CHAdeMO",
    "connector-type2": props.station.connectorType === "Type 2",
    "connector-type1": props.station.connectorType === "Type 1",
    "connector-tesla": props.station.connectorType === "Tesla Supercharger",
  };
});

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const editDetails = () => {
  router.push(`/edit-station/${props.station._id}`);
};

const showOnMap = () => {
  router.push(`/map?latitude=${props.station.location.latitude}&longitude=${props.station.location.longitude}`);
};

const deleteStation = () => {
  if (!isAuthenticated) {
    router.push("/login");
    return;
  }
  emit("delete-station", props.station);
};
</script>

<style scoped>
.charging-station-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.charging-station-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 200% 0;
  }
  50% {
    background-position: -200% 0;
  }
}

.charging-station-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.station-info .station-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.station-id {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 600;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
}

/* Status Badge */
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.status-active {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

.status-active .status-indicator {
  background: #68d391;
}

.status-inactive {
  background: linear-gradient(135deg, #a0aec0, #718096);
  color: white;
}

.status-inactive .status-indicator {
  background: #cbd5e0;
}

.status-maintenance {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
}

.status-maintenance .status-indicator {
  background: #f6ad55;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Power Section */
.power-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.power-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.power-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.power-info {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.power-value {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
}

.power-unit {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
}

.connector-info .connector-type {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.connector-ccs {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
}

.connector-chademo {
  background: linear-gradient(135deg, #38a169, #2f855a);
  color: white;
}

.connector-type2 {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
}
.connector-type1 {
  background: linear-gradient(135deg, #5100ff, #6200ff);
  color: white;
}

.connector-tesla {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
}

/* Location Section */
.location-section {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.location-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.location-icon {
  font-size: 1.25rem;
}

.location-label {
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.coordinates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.coordinate {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coord-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coord-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

/* Timestamps */
.timestamps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.timestamp {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timestamp-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timestamp-value {
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 500;
}

/* Action Buttons */
.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.primary:hover {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.action-btn.secondary:hover {
  box-shadow: 0 6px 16px rgba(66, 153, 225, 0.4);
  background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
}

.action-btn.danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

.action-btn.danger:hover {
  box-shadow: 0 6px 16px rgba(245, 101, 101, 0.4);
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
}

/* SVG Icons */
.action-btn svg {
  width: 1rem;
  height: 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .charging-station-card {
    padding: 1.25rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .power-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .coordinates {
    grid-template-columns: 1fr;
  }

  .timestamps {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    padding: 1rem;
  }
}

/* Animation for card entrance */
@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.charging-station-card {
  animation: cardEntrance 0.6s ease-out;
}

/* Hover effects for interactive elements */
.coord-value:hover,
.timestamp-value:hover {
  background: #e2e8f0;
  transition: background-color 0.2s ease;
}

.station-id:hover {
  background: #e2e8f0;
  transition: background-color 0.2s ease;
}
</style>
