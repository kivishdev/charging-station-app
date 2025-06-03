<template>
  <div class="chargers-container">
    <!-- Header -->
    <header class="header-bar">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">⚡</div>
          <h2>Charging Stations</h2>
        </div>
        <button class="btn btn-danger logout-btn" @click="logout">
          <i class="logout-icon">🚪</i>
          Logout
        </button>
      </div>
    </header>

    <!-- Tabs for List and Map View -->
    <div class="tabs-container">
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'" href="#">
            <span class="tab-icon">📋</span>
            List View
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'map' }" @click="activeTab = 'map'" href="#">
            <span class="tab-icon">🗺️</span>
            Map View
          </a>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading stations...</p>
    </div>
    <div v-else>
      <!-- List View -->
      <div v-if="activeTab === 'list'">
        <!-- Filters -->
        <div class="filters card mb-4">
          <div class="card-body">
            <div class="filter-header">
              <h5 class="card-title">
                <span class="filter-icon">🔍</span>
                Filters
              </h5>
              <div class="results-count">
                {{ filteredStations.length }} station{{ filteredStations.length !== 1 ? 's' : '' }} found
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">
                  <span class="label-icon">📊</span>
                  Status
                </label>
                <select v-model="filters.status" class="form-control modern-select">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">
                  <span class="label-icon">⚡</span>
                  Minimum Power Output (kW)
                </label>
                <input v-model.number="filters.powerOutput" type="number" class="form-control modern-input" placeholder="Min Power Output" />
              </div>
              <div class="col-md-4">
                <label class="form-label">
                  <span class="label-icon">🔌</span>
                  Connector Type
                </label>
                <input v-model="filters.connectorType" type="text" class="form-control modern-input" placeholder="Connector Type" />
              </div>
            </div>
            <button class="btn btn-outline-secondary clear-btn" @click="clearFilters">
              <span class="btn-icon">🧹</span>
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Create Station Form -->
        <div class="create-form card mb-4">
          <div class="card-body">
            <h5 class="card-title">
              <span class="add-icon">➕</span>
              Add New Station
            </h5>
            <form @submit.prevent="createStation">
              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label">Station Name</label>
                  <input v-model="newStation.name" type="text" class="form-control modern-input" placeholder="Enter station name" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Latitude</label>
                  <input v-model="newStation.location.latitude" type="text" class="form-control modern-input" placeholder="Latitude" required />
                  <small v-if="createErrors.latitude" class="text-danger">{{ createErrors.latitude }}</small>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Longitude</label>
                  <input v-model="newStation.location.longitude" type="text" class="form-control modern-input" placeholder="Longitude" required />
                  <small v-if="createErrors.longitude" class="text-danger">{{ createErrors.longitude }}</small>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label">Status</label>
                  <select v-model="newStation.status" class="form-control modern-select" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Power Output (kW)</label>
                  <input v-model.number="newStation.powerOutput" type="number" class="form-control modern-input" placeholder="Power Output" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Connector Type</label>
                  <input v-model="newStation.connectorType" type="text" class="form-control modern-input" placeholder="e.g., Type 2, CCS" required />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-info location-btn" @click="startSelectingLocation">
                  <span class="btn-icon">📍</span>
                  Select Location on Map
                </button>
                <button type="submit" class="btn btn-primary add-btn" :disabled="creating">
                  <span class="btn-icon">{{ creating ? '⏳' : '➕' }}</span>
                  {{ creating ? 'Adding...' : 'Add Station' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Stations Table -->
        <div class="table-container">
          <table class="table table-bordered chargers-table">
            <thead>
              <tr>
                <th>
                  <span class="th-icon">🏢</span>
                  Name
                </th>
                <th>
                  <span class="th-icon">📍</span>
                  Location
                </th>
                <th>
                  <span class="th-icon">📊</span>
                  Status
                </th>
                <th>
                  <span class="th-icon">⚡</span>
                  Power (kW)
                </th>
                <th>
                  <span class="th-icon">🔌</span>
                  Connector
                </th>
                <th>
                  <span class="th-icon">⚙️</span>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="station in filteredStations" :key="station._id" class="station-row">
                <td class="station-name">{{ station.name }}</td>
                <td class="station-location">{{ station.location.latitude }}, {{ station.location.longitude }}</td>
                <td>
                  <span class="status-badge" :class="station.status.toLowerCase()">
                    {{ station.status }}
                  </span>
                </td>
                <td class="power-output">{{ station.powerOutput }}</td>
                <td class="connector-type">{{ station.connectorType }}</td>
                <td class="actions">
                  <button class="btn btn-warning btn-sm action-btn edit-btn me-2" @click="editStation(station)">
                    <span class="btn-icon">✏️</span>
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm action-btn delete-btn" @click="deleteStation(station._id)">
                    <span class="btn-icon">🗑️</span>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Edit Station Modal -->
        <div v-if="editingStation" class="modal-overlay">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <span class="modal-icon">✏️</span>
                  Edit Station
                </h5>
                <button type="button" class="btn-close" @click="editingStation = null">&times;</button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateStation">
                  <div class="mb-3">
                    <label class="form-label">Station Name</label>
                    <input v-model="editingStation.name" type="text" class="form-control modern-input" required />
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <label class="form-label">Latitude</label>
                      <input v-model="editingStation.location.latitude" type="text" class="form-control modern-input" required />
                      <small v-if="editErrors.latitude" class="text-danger">{{ editErrors.latitude }}</small>
                    </div>
                    <div class="col-6">
                      <label class="form-label">Longitude</label>
                      <input v-model="editingStation.location.longitude" type="text" class="form-control modern-input" required />
                      <small v-if="editErrors.longitude" class="text-danger">{{ editErrors.longitude }}</small>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <label class="form-label">Status</label>
                      <select v-model="editingStation.status" class="form-control modern-select" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label">Power Output (kW)</label>
                      <input v-model.number="editingStation.powerOutput" type="number" class="form-control modern-input" required />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Connector Type</label>
                    <input v-model="editingStation.connectorType" type="text" class="form-control modern-input" required />
                  </div>
                  <div class="modal-actions">
                    <button type="submit" class="btn btn-primary" :disabled="updating">
                      <span class="btn-icon">{{ updating ? '⏳' : '💾' }}</span>
                      {{ updating ? 'Updating...' : 'Update' }}
                    </button>
                    <button type="button" class="btn btn-secondary ms-2" @click="editingStation = null">
                      <span class="btn-icon">❌</span>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map View -->
      <div v-if="activeTab === 'map'" class="map-container">
        <div v-if="filteredStations.length === 0 && !selectingLocation" class="no-stations">
          <div class="no-stations-icon">🗺️</div>
          <h4>No stations to display</h4>
          <p>Add some charging stations to see them on the map!</p>
        </div>
        <div v-else>
          <div v-if="selectingLocation" class="location-selection-message">
            <div class="selection-info">
              <span class="selection-icon">📍</span>
              <p>Click anywhere on the map to select the location for your new station</p>
            </div>
            <div class="selection-actions">
              <button class="btn btn-success me-2" @click="confirmLocation" :disabled="!tempLocation">
                <span class="btn-icon">✅</span>
                Confirm Location
              </button>
              <button class="btn btn-secondary" @click="cancelSelectingLocation">
                <span class="btn-icon">❌</span>
                Cancel
              </button>
            </div>
          </div>
          <div class="map-wrapper">
            <div id="map" class="modern-map"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import L from 'leaflet';


axios.defaults.baseURL=import.meta.env.VUE_APP_API_BASE_URL;

export default {
  name: 'ChargersView',
  data() {
    return {
      stations: [],
      loading: false,
      activeTab: 'list',
      map: null,
      markers: [],
      newStation: {
        name: '',
        location: { latitude: '', longitude: '' },
        status: 'Active',
        powerOutput: 0,
        connectorType: '',
      },
      filters: {
        status: '',
        powerOutput: null,
        connectorType: '',
      },
      editingStation: null,
      creating: false,
      updating: false,
      selectingLocation: false,
      tempMarker: null,
      tempLocation: null,
      createErrors: {
        latitude: '',
        longitude: '',
      },
      editErrors: {
        latitude: '',
        longitude: '',
      },
      mapInitialized: false,
    };
  },
  computed: {
    filteredStations() {
      return this.stations.filter(station => {
        const matchesStatus = !this.filters.status || station.status === this.filters.status;
        const matchesPowerOutput =
          this.filters.powerOutput === null ||
          this.filters.powerOutput === '' ||
          station.powerOutput >= this.filters.powerOutput;
        const matchesConnectorType =
          !this.filters.connectorType ||
          station.connectorType.toLowerCase().includes(this.filters.connectorType.toLowerCase());
        return matchesStatus && matchesPowerOutput && matchesConnectorType;
      });
    },
  },
  watch: {
    filteredStations(newStations) {
      if (this.activeTab === 'map' && newStations.length > 0) {
        this.updateMap();
      }
    },
    activeTab(newTab, oldTab) {
      if (newTab === 'map') {
        this.$nextTick(() => {
          const mapElement = document.getElementById('map');
          if (!mapElement) {
            console.error('Map element not found in DOM');
            toast.error('Map container not found');
            return;
          }
          if (!this.mapInitialized) {
            this.initMap();
            this.mapInitialized = true;
          }
          if (!this.selectingLocation) {
            this.updateMap(oldTab === 'list' ? 6 : null);
          }
          if (this.map) {
            this.map.invalidateSize();
          }
        });
      } else if (newTab === 'list' && this.map) {
        this.map.remove();
        this.map = null;
        this.markers = [];
        this.tempMarker = null;
        this.mapInitialized = false;
      }
    },
  },
  async created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/');
    } else {
      await this.fetchStations();
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = [];
      this.tempMarker = null;
      this.mapInitialized = false;
    }
  },
  methods: {
    clearFilters() {
      this.filters.status = '';
      this.filters.powerOutput = null;
      this.filters.connectorType = '';
    },
    initMap() {
      try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          throw new Error('Map element not found in DOM');
        }

        // Default to India center coordinates with appropriate zoom
        let center = [20.5937, 78.9629]; // India center coordinates
        let defaultZoom = 5; // Good zoom level for India view

        // If we have stations, calculate center based on them
        if (this.stations.length > 0) {
          const validStations = this.stations.filter(station => {
            const lat = parseFloat(station.location.latitude);
            const lng = parseFloat(station.location.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
          });

          if (validStations.length > 0) {
            const avgLat = validStations.reduce((sum, station) => sum + parseFloat(station.location.latitude), 0) / validStations.length;
            const avgLng = validStations.reduce((sum, station) => sum + parseFloat(station.location.longitude), 0) / validStations.length;
            
            // Check if stations are in India region (rough bounds)
            if (avgLat >= 6 && avgLat <= 37 && avgLng >= 68 && avgLng <= 97) {
              center = [avgLat, avgLng];
              defaultZoom = 6;
            }
          }
        }

        this.map = L.map(mapElement).setView(center, defaultZoom);
        
        // Enhanced tile layer with better styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3
        }).addTo(this.map);

        this.map.on('click', (e) => {
          if (this.selectingLocation) {
            let { lat, lng } = e.latlng;
            lat = Math.max(-90, Math.min(90, lat));
            lng = ((lng + 180) % 360) - 180;
            this.tempLocation = { latitude: lat, longitude: lng };

            if (this.tempMarker) {
              this.tempMarker.remove();
            }

            // Enhanced temporary marker with pulsing animation
            this.tempMarker = L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'temp-marker-enhanced',
                html: `
                  <div class="marker-pulse">
                    <div class="marker-pin">📍</div>
                  </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            }).addTo(this.map);

            // Dynamic zoom based on current zoom level for better UX
            const currentZoom = this.map.getZoom();
            let targetZoom = currentZoom;
            
            if (currentZoom < 10) {
              targetZoom = 12;
            } else if (currentZoom < 15) {
              targetZoom = Math.min(currentZoom + 2, 16);
            }

            // Smooth pan and zoom to selected location
            this.map.flyTo([lat, lng], targetZoom, {
              duration: 1.5,
              easeLinearity: 0.25
            });
          }
        });
      } catch (error) {
        console.error('Detailed error initializing map:', error);
        toast.error(`Failed to initialize map: ${error.message}`);
      }
    },
    updateMap(forcedZoom = null) {
      if (!this.map) return;

      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      const validStations = this.filteredStations.filter(station => {
        const lat = parseFloat(station.location.latitude);
        const lng = parseFloat(station.location.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
      });

      validStations.forEach(station => {
        const lat = parseFloat(station.location.latitude);
        const lng = parseFloat(station.location.longitude);
        
        // Enhanced markers with custom styling
        const markerHtml = `
          <div class="custom-marker ${station.status.toLowerCase()}">
            <div class="marker-inner">⚡</div>
          </div>
        `;
        
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-marker-wrapper',
            html: markerHtml,
            iconSize: [25, 25],
            iconAnchor: [12, 12],
          })
        })
          .addTo(this.map)
          .bindPopup(`
            <div class="enhanced-popup">
              <div class="popup-header">
                <h6>${station.name}</h6>
                <span class="popup-status ${station.status.toLowerCase()}">${station.status}</span>
              </div>
              <div class="popup-content">
                <div class="popup-row">
                  <span class="popup-label">📍 Location:</span>
                  <span class="popup-value">${station.location.latitude}, ${station.location.longitude}</span>
                </div>
                <div class="popup-row">
                  <span class="popup-label">⚡ Power:</span>
                  <span class="popup-value">${station.powerOutput} kW</span>
                </div>
                <div class="popup-row">
                  <span class="popup-label">🔌 Connector:</span>
                  <span class="popup-value">${station.connectorType}</span>
                </div>
              </div>
            </div>
          `, {
            maxWidth: 280,
            className: 'custom-popup'
          });
        this.markers.push(marker);
      });

      if (validStations.length > 0) {
        const lats = validStations.map(station => parseFloat(station.location.latitude));
        const lngs = validStations.map(station => parseFloat(station.location.longitude));
        const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
        const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
        const center = [avgLat, avgLng];

        if (forcedZoom !== null) {
          this.map.flyTo(center, forcedZoom, { duration: 1.2 });
          return;
        }

        // Enhanced zoom calculation for better user experience
        const maxLat = Math.max(...lats);
        const minLat = Math.min(...lats);
        const maxLng = Math.max(...lngs);
        const minLng = Math.min(...lngs);
        const latDiff = maxLat - minLat;
        const lngDiff = maxLng - minLng;
        const maxDiff = Math.max(latDiff, lngDiff);
        
        let zoom = 6;
        if (maxDiff < 0.001) zoom = 18;
        else if (maxDiff < 0.01) zoom = 15;
        else if (maxDiff < 0.1) zoom = 12;
        else if (maxDiff < 1) zoom = 9;
        else if (maxDiff < 5) zoom = 7;
        else if (maxDiff < 20) zoom = 5;
        else zoom = 4;

        this.map.flyTo(center, zoom, { duration: 1.2 });
      } else {
        // No stations, show India view
        this.map.flyTo([20.5937, 78.9629], 5, { duration: 1.2 });
      }
    },
    startSelectingLocation() {
      this.selectingLocation = true;
      this.tempLocation = null;
      if (this.tempMarker) {
        this.tempMarker.remove();
        this.tempMarker = null;
      }
      this.activeTab = 'map';
    },
    confirmLocation() {
      if (this.tempLocation) {
        this.newStation.location.latitude = this.tempLocation.latitude.toString();
        this.newStation.location.longitude = this.tempLocation.longitude.toString();
        const isValid = this.validateCoordinates(this.newStation.location.latitude, this.newStation.location.longitude, true);
        if (!isValid) {
          this.tempLocation = null;
          if (this.tempMarker) {
            this.tempMarker.remove();
            this.tempMarker = null;
          }
          return;
        }
        this.selectingLocation = false;
        this.tempLocation = null;
        if (this.tempMarker) {
          this.tempMarker.remove();
          this.tempMarker = null;
        }
        this.activeTab = 'list';
        toast.success('📍 Location selected! Please fill out the remaining fields.');
        this.createErrors.latitude = '';
        this.createErrors.longitude = '';
      }
    },
    cancelSelectingLocation() {
      this.selectingLocation = false;
      this.tempLocation = null;
      if (this.tempMarker) {
        this.tempMarker.remove();
        this.tempMarker = null;
      }
      this.activeTab = 'list';
    },
    validateCoordinates(latitude, longitude, isCreate = true) {
      const errors = isCreate ? this.createErrors : this.editErrors;
      errors.latitude = '';
      errors.longitude = '';

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      let isValid = true;

      if (isNaN(lat)) {
        errors.latitude = 'Latitude must be a valid number';
        isValid = false;
      } else if (lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
        isValid = false;
      }

      if (isNaN(lng)) {
        errors.longitude = 'Longitude must be a valid number';
        isValid = false;
      } else if (lng < -180 || lng > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
        isValid = false;
      }

      return isValid;
    },
    async fetchStations() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:5000/api/stations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.stations = [...response.data];
      } catch (error) {
        console.error('Error fetching stations:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          this.$router.push('/');
        } else {
          toast.error(error.response?.data?.message || 'Failed to fetch stations');
        }
      } finally {
        this.loading = false;
      }
    },
    async createStation() {
      const isValid = this.validateCoordinates(this.newStation.location.latitude, this.newStation.location.longitude, true);
      if (!isValid) {
        return;
      }

      this.creating = true;
      try {
        const stationData = {
          ...this.newStation,
          location: {
            latitude: parseFloat(this.newStation.location.latitude),
            longitude: parseFloat(this.newStation.location.longitude),
          },
        };
        await axios.post('http://localhost:5000/api/stations', stationData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('✅ Station created successfully!');
        this.newStation = { name: '', location: { latitude: '', longitude: '' }, status: 'Active', powerOutput: 0, connectorType: '' };
        this.createErrors.latitude = '';
        this.createErrors.longitude = '';
        this.clearFilters();
        await this.fetchStations();
      } catch (error) {
        console.error('Error creating station:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          this.$router.push('/');
        } else {
          toast.error(error.response?.data?.message || 'Failed to create station');
        }
      } finally {
        this.creating = false;
      }
    },
    editStation(station) {
      this.editingStation = { ...station };
      this.editErrors.latitude = '';
      this.editErrors.longitude = '';
    },
    async updateStation() {
      const isValid = this.validateCoordinates(this.editingStation.location.latitude, this.editingStation.location.longitude, false);
      if (!isValid) {
        return;
      }

      this.updating = true;
      try {
        const stationData = {
          ...this.editingStation,
          location: {
            latitude: parseFloat(this.editingStation.location.latitude),
            longitude: parseFloat(this.editingStation.location.longitude),
          },
        };
        await axios.put(`http://localhost:5000/api/stations/${this.editingStation._id}`, stationData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('✅ Station updated successfully!');
        this.editingStation = null;
        this.editErrors.latitude = '';
        this.editErrors.longitude = '';
        await this.fetchStations();
      } catch (error) {
        console.error('Error updating station:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          this.$router.push('/');
        } else {
          toast.error(error.response?.data?.message || 'Failed to update station');
        }
      } finally {
        this.updating = false;
      }
    },
    async deleteStation(stationId) {
      if (!confirm('Are you sure you want to delete this station?')) {
        return;
      }
      try {
        await axios.delete(`http://localhost:5000/api/stations/${stationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('🗑️ Station deleted successfully!');
        await this.fetchStations();
      } catch (error) {
        console.error('Error deleting station:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          this.$router.push('/');
        } else {
          toast.error(error.response?.data?.message || 'Failed to delete station');
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
      toast.success('👋 Logged out successfully!');
    },
  },
};
</script>

<style scoped>
/* Global Styles */

.chargers-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.header-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  font-size: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.header-content h2 {
  margin: 0;
  color: #2d3748;
  font-weight: 700;
  font-size: 1.8rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(238, 90, 82, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(238, 90, 82, 0.4);
}

.logout-icon {
  font-size: 1.2rem;
}

/* Main Content */
.chargers-container > div:not(.header-bar) {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tabs */
.tabs-container {
  margin-bottom: 2rem;
}

.nav-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem;
}

.nav-tabs .nav-item {
  margin-bottom: 0;
}

.nav-tabs .nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-tabs .nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-tabs .nav-link.active {
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
  font-weight: 700;
  font-size: 1.25rem;
}

/* Filters */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-count {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-icon, .label-icon, .add-icon, .btn-icon, .th-icon, .modal-icon {
  font-size: 1.1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.modern-input, .modern-select {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input:focus, .modern-select:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  outline: none;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  border-color: #cbd5e0;
  background: #f8fafc;
  transform: translateY(-1px);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.location-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #17a2b8, #138496);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.location-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(23, 162, 184, 0.3);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
}

.add-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Table */
.table-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chargers-table {
  margin: 0;
  border: none;
}

.chargers-table thead th {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  padding: 1rem;
  border: none;
  font-size: 0.95rem;
}

.chargers-table tbody td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.station-row:hover {
  background: rgba(79, 172, 254, 0.05);
}

.station-name {
  font-weight: 600;
  color: #2d3748;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.status-badge.active {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
}

.status-badge.inactive {
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
}

.power-output {
  font-weight: 600;
  color: #2d3748;
}

.connector-type {
  font-style: italic;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(45deg, #ffc107, #e0a800);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
}

.delete-btn {
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(220, 53, 69, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #2d3748;
  font-weight: 700;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-actions .btn-primary {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
}

.modal-actions .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
}

.modal-actions .btn-secondary {
  background: #6c757d;
  color: white;
}

.modal-actions .btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* Map Container */
.map-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.no-stations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
}

.no-stations-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-stations h4 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.location-selection-message {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selection-icon {
  font-size: 1.5rem;
}

.selection-actions {
  display: flex;
  gap: 1rem;
}

.selection-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.selection-actions .btn-success {
  background: #28a745;
  color: white;
}

.selection-actions .btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.selection-actions .btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.selection-actions .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.map-wrapper {
  position: relative;
  height: 600px;
}

.modern-map {
  width: 100%;
  height: 100%;
  border-radius: 0 0 16px 16px;
}

/* Map Marker Styles - Using :deep() for proper scoping */
:deep(.custom-marker-wrapper) {
  background: none !important;
  border: none !important;
}

:deep(.custom-marker) {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

:deep(.custom-marker.active) {
  background: linear-gradient(45deg, #28a745, #20c997);
}

:deep(.custom-marker.inactive) {
  background: linear-gradient(45deg, #dc3545, #c82333);
}

:deep(.custom-marker:hover) {
  transform: scale(1.2);
}

:deep(.marker-inner) {
  color: white;
  font-size: 14px;
}

:deep(.temp-marker-enhanced) {
  background: none !important;
  border: none !important;
}

:deep(.marker-pulse) {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.marker-pulse::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(79, 172, 254, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

:deep(.marker-pin) {
  font-size: 20px;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Custom Popup Styles */
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  width: auto !important;
}

:deep(.enhanced-popup) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:deep(.popup-header) {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.popup-header h6) {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
}

:deep(.popup-status) {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

:deep(.popup-status.active) {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

:deep(.popup-status.inactive) {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

:deep(.popup-content) {
  padding: 1rem;
}

:deep(.popup-row) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

:deep(.popup-row:last-child) {
  margin-bottom: 0;
}

:deep(.popup-label) {
  font-weight: 600;
  color: #64748b;
  font-size: 0.9rem;
}

:deep(.popup-value) {
  color: #2d3748;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Error Styles */
.text-danger {
  color: #dc3545 !important;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chargers-container > div:not(.header-bar) {
    padding: 1rem;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .header-content h2 {
    font-size: 1.5rem;
  }
  
  .filter-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .selection-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .location-selection-message {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .table-container {
    overflow-x: auto;
  }
  
  .chargers-table {
    min-width: 700px;
  }
  
  .modal-dialog {
    margin: 1rem;
    max-width: none;
  }
}
</style>