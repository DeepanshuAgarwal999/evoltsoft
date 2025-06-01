<template>
  <div class="filter-container">
    <div class="filter-header">
      <h3 class="filter-title">🔍 Filter Stations</h3>
      <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-btn" title="Clear all filters">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Clear All
      </button>
    </div>

    <div class="">
      <!-- Status Filter -->
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <select v-model="filters.status" @change="applyFilters" class="filter-select">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <!-- Power Output Filter -->
      <div class="filter-group">
        <label class="filter-label">Power Output (kW)</label>
        <select v-model="filters.powerOutput" @change="applyFilters" class="filter-select">
          <option value="">All Power</option>
          <option value="7">7 kW</option>
          <option value="11">11 kW</option>
          <option value="22">22 kW</option>
          <option value="43">43 kW</option>
          <option value="50">50 kW</option>
          <option value="100">100 kW</option>
          <option value="150">150 kW</option>
          <option value="250">250 kW</option>
        </select>
      </div>

      <!-- Connector Type Filter -->
      <div class="filter-group">
        <label class="filter-label">Connector Type</label>
        <select v-model="filters.connectorType" @change="applyFilters" class="filter-select">
          <option value="">All Types</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="CCS">CCS</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Tesla Supercharger">Tesla Supercharger</option>
        </select>
      </div>

      <!-- Sort Filter -->
      <div class="filter-group">
        <label class="filter-label">Sort By</label>
        <select v-model="filters.sort" @change="applyFilters" class="filter-select">
          <option value="">Default</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <!-- Search by Name -->
      <div class="filter-group search-group">
        <label class="filter-label">Search by Name</label>
        <div class="search-input-container">
          <input v-model="filters.name" @input="debouncedApplyFilters" type="text" placeholder="Station name..." class="search-input" />
          <svg v-if="!filters.name" class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button v-if="filters.name" @click="clearSearch" class="clear-search-btn" title="Clear search">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filters-header">
        <span class="active-filters-title">Active Filters:</span>
      </div>
      <div class="active-filters-list">
        <span v-if="filters.status" class="filter-tag">
          Status: {{ filters.status }}
          <button @click="clearFilter('status')" class="filter-tag-remove">×</button>
        </span>
        <span v-if="filters.powerOutput" class="filter-tag">
          Power: {{ filters.powerOutput }}kW
          <button @click="clearFilter('powerOutput')" class="filter-tag-remove">×</button>
        </span>
        <span v-if="filters.connectorType" class="filter-tag">
          Type: {{ filters.connectorType }}
          <button @click="clearFilter('connectorType')" class="filter-tag-remove">×</button>
        </span>
        <span v-if="filters.sort" class="filter-tag">
          Sort: {{ filters.sort === "newest" ? "Newest First" : "Oldest First" }}
          <button @click="clearFilter('sort')" class="filter-tag-remove">×</button>
        </span>
        <span v-if="filters.name" class="filter-tag">
          Name: {{ filters.name }}
          <button @click="clearFilter('name')" class="filter-tag-remove">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Define emits
const emit = defineEmits(["filtersChanged"]);

// Filter state
const filters = ref({
  status: "",
  powerOutput: "",
  connectorType: "",
  sort: "",
  name: "",
});

// Computed property to check if any filters are active
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some((value) => value !== "");
});

// Debounce timer for search input
let debounceTimer = null;
// Flag to prevent circular updates
let isUpdatingFromRoute = false;
let isUpdatingFromFilter = false;

// Initialize filters from URL query parameters
const initializeFiltersFromURL = () => {
  const query = route.query;
  isUpdatingFromRoute = true;

  const newFilters = {
    status: query.status || "",
    powerOutput: query.powerOutput || "",
    connectorType: query.connectorType || "",
    sort: query.sort || "",
    name: query.name || "",
  };

  // Only update if filters actually changed
  const filtersChanged = JSON.stringify(filters.value) !== JSON.stringify(newFilters);
  if (filtersChanged) {
    filters.value = newFilters;
  }

  isUpdatingFromRoute = false;
  return filtersChanged;
};

// Apply filters and update URL
const applyFilters = () => {
  // Prevent circular updates
  if (isUpdatingFromRoute || isUpdatingFromFilter) {
    return;
  }

  isUpdatingFromFilter = true;

  // Clear debounce timer if it exists
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Create query object with only non-empty values
  const query = {};
  Object.keys(filters.value).forEach((key) => {
    if (filters.value[key]) {
      query[key] = filters.value[key];
    }
  });

  // Only update URL if query is different from current
  const currentQuery = route.query;
  const queryChanged = JSON.stringify(currentQuery) !== JSON.stringify(query);

  if (queryChanged) {
    // Update URL with new query parameters
    router.replace({
      path: route.path,
      query: query,
    });
  }

  // Always emit filter change event (even if URL didn't change)
  emit("filtersChanged", { ...filters.value });

  setTimeout(() => {
    isUpdatingFromFilter = false;
  }, 100);
};

// Debounced version for search input
const debouncedApplyFilters = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    applyFilters();
  }, 500); // 500ms delay
};

// Clear a specific filter
const clearFilter = (filterKey) => {
  filters.value[filterKey] = "";
  applyFilters();
};

// Clear search specifically
const clearSearch = () => {
  filters.value.name = "";
  applyFilters();
};

// Clear all filters
const clearAllFilters = () => {
  // Prevent circular updates
  if (isUpdatingFromRoute || isUpdatingFromFilter) {
    return;
  }

  isUpdatingFromFilter = true;

  filters.value = {
    status: "",
    powerOutput: "",
    connectorType: "",
    sort: "",
    name: "",
  };

  // Update URL to remove all query parameters
  router.replace({
    path: route.path,
    query: {},
  });

  // Emit filter change event
  emit("filtersChanged", { ...filters.value });

  setTimeout(() => {
    isUpdatingFromFilter = false;
  }, 100);
};

// Watch for route changes to update filters
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // Only update if the query actually changed and we're not in the middle of updating
    if (!isUpdatingFromRoute && !isUpdatingFromFilter && JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      const filtersChanged = initializeFiltersFromURL();
      if (filtersChanged) {
        emit("filtersChanged", { ...filters.value });
      }
    }
  },
  { deep: true }
);

// Initialize on component mount
onMounted(() => {
  const filtersChanged = initializeFiltersFromURL();
  // Emit initial filter state only if there are active filters
  if (hasActiveFilters.value || filtersChanged) {
    emit("filtersChanged", { ...filters.value });
  }
});
</script>

<style scoped>
.filter-container {
  background: white;
  border-radius: 16px;
  padding: .8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: .5rem;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.search-group {
  grid-column: span 2;
  max-width: 400px;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.filter-select,
.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.925rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding-right: 2.5rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #a0aec0;
  pointer-events: none;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.clear-search-btn:hover {
  color: #e53e3e;
}

/* Active Filters */
.active-filters {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.25rem;
}

.active-filters-header {
  margin-bottom: 0.75rem;
}

.active-filters-title {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
}

.active-filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.filter-tag-remove {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.filter-tag-remove:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-container {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .search-group {
    grid-column: span 1;
    max-width: none;
  }

  .filter-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .clear-btn {
    align-self: flex-end;
    width: fit-content;
  }

  .active-filters-list {
    gap: 0.375rem;
  }

  .filter-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .filters-grid {
    gap: 0.75rem;
  }

  .filter-select,
  .search-input {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
