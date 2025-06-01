<template>
  <div class="chargers-container">
    <!-- Header -->
    <header class="header-bar">
      <h2>Charging Stations</h2>
      <button class="btn btn-danger logout-btn" @click="logout">Logout</button>
    </header>

    <!-- Tabs for List and Map View -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'" href="#">List View</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'map' }" @click="activeTab = 'map'" href="#">Map View</a>
      </li>
    </ul>

    <!-- Tab Content -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading stations...</p>
    </div>
    <div v-else>
      <!-- List View -->
      <div v-if="activeTab === 'list'">
        <!-- Create Station Form -->
        <div class="create-form card mb-3">
          <div class="card-body">
            <h5 class="card-title">Add New Station</h5>
            <form @submit.prevent="createStation">
              <div class="row mb-3">
                <div class="col">
                  <input v-model="newStation.name" type="text" class="form-control" placeholder="Name" required />
                </div>
                <div class="col">
                  <input v-model.number="newStation.location.latitude" type="number" step="0.01" class="form-control" placeholder="Latitude" required />
                </div>
                <div class="col">
                  <input v-model.number="newStation.location.longitude" type="number" step="0.01" class="form-control" placeholder="Longitude" required />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <select v-model="newStation.status" class="form-control" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div class="col">
                  <input v-model.number="newStation.powerOutput" type="number" class="form-control" placeholder="Power Output (kW)" required />
                </div>
                <div class="col">
                  <input v-model="newStation.connectorType" type="text" class="form-control" placeholder="Connector Type" required />
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="creating">Add Station</button>
            </form>
          </div>
        </div>

        <!-- Stations Table -->
        <table class="table table-bordered chargers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Power Output (kW)</th>
              <th>Connector Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="station in stations" :key="station._id">
              <td>{{ station.name }}</td>
              <td>{{ station.location.latitude }}, {{ station.location.longitude }}</td>
              <td>{{ station.status }}</td>
              <td>{{ station.powerOutput }}</td>
              <td>{{ station.connectorType }}</td>
              <td>
                <button class="btn btn-warning btn-sm me-2" @click="editStation(station)">Edit</button>
                <button class="btn btn-danger btn-sm" @click="deleteStation(station._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Edit Station Modal -->
        <div v-if="editingStation" class="modal" style="display: block; background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
          <div class="modal-dialog" style="margin: 100px auto;">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Station</h5>
                <button type="button" class="btn-close" @click="editingStation = null"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateStation">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="editingStation.name" type="text" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Latitude</label>
                    <input v-model.number="editingStation.location.latitude" type="number" step="0.01" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Longitude</label>
                    <input v-model.number="editingStation.location.longitude" type="number" step="0.01" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select v-model="editingStation.status" class="form-control" required>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Power Output (kW)</label>
                    <input v-model.number="editingStation.powerOutput" type="number" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Connector Type</label>
                    <input v-model="editingStation.connectorType" type="text" class="form-control" required />
                  </div>
                  <button type="submit" class="btn btn-primary" :disabled="updating">Update</button>
                  <button type="button" class="btn btn-secondary ms-2" @click="editingStation = null">Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map View -->
      <div v-if="activeTab === 'map'" class="map-container">
        <div v-if="stations.length === 0" class="no-stations">
          <p>No charging stations to display on the map.</p>
        </div>
        <div v-else id="map" style="height: 500px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import L from 'leaflet';

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
        location: { latitude: 0, longitude: 0 },
        status: 'Active',
        powerOutput: 0,
        connectorType: '',
      },
      editingStation: null,
      creating: false,
      updating: false,
    };
  },
  watch: {
    stations(newStations) {
      if (this.activeTab === 'map' && newStations.length > 0) {
        this.updateMap();
      }
    },
    activeTab(newTab) {
      if (newTab === 'map' && this.stations.length > 0) {
        this.$nextTick(() => {
          this.initMap();
          this.updateMap();
        });
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
    }
  },
  methods: {
    async fetchStations() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:5000/api/stations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.stations = response.data;
      } catch (error) {
        console.error('Error fetching stations:', error);
        toast.error('Failed to fetch stations');
        this.$router.push('/');
      } finally {
        this.loading = false;
      }
    },
    initMap() {
      if (this.map) return;

      let center = [0, 0];
      if (this.stations.length > 0) {
        const avgLat = this.stations.reduce((sum, station) => sum + station.location.latitude, 0) / this.stations.length;
        const avgLng = this.stations.reduce((sum, station) => sum + station.location.longitude, 0) / this.stations.length;
        center = [avgLat, avgLng];
      }

      this.map = L.map('map').setView(center, 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    },
    updateMap() {
      if (!this.map) return;

      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      this.stations.forEach(station => {
        const marker = L.marker([station.location.latitude, station.location.longitude])
          .addTo(this.map)
          .bindPopup(`
            <div class="popup-content">
              <h6>${station.name}</h6>
              <p><strong>Location:</strong> ${station.location.latitude}, ${station.location.longitude}</p>
              <p><strong>Status:</strong> ${station.status}</p>
              <p><strong>Power Output:</strong> ${station.powerOutput} kW</p>
              <p><strong>Connector Type:</strong> ${station.connectorType}</p>
            </div>
          `);
        this.markers.push(marker);
      });

      if (this.markers.length > 0) {
        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    },
    async createStation() {
      this.creating = true;
      try {
        await axios.post('http://localhost:5000/api/stations', this.newStation, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Station created!');
        this.newStation = { name: '', location: { latitude: 0, longitude: 0 }, status: 'Active', powerOutput: 0, connectorType: '' };
        await this.fetchStations();
      } catch (error) {
        console.error('Error creating station:', error);
        toast.error(error.response?.data?.message || 'Failed to create station');
      } finally {
        this.creating = false;
      }
    },
    editStation(station) {
      this.editingStation = { ...station };
    },
    async updateStation() {
      this.updating = true;
      try {
        await axios.put(`http://localhost:5000/api/stations/${this.editingStation._id}`, this.editingStation, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Station updated!');
        this.editingStation = null;
        await this.fetchStations();
      } catch (error) {
        console.error('Error updating station:', error);
        toast.error(error.response?.data?.message || 'Failed to update station');
      } finally {
        this.updating = false;
      }
    },
    async deleteStation(id) {
      if (confirm('Are you sure you want to delete this station?')) {
        try {
          await axios.delete(`http://localhost:5000/api/stations/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          toast.success('Station deleted!');
          await this.fetchStations();
        } catch (error) {
          console.error('Error deleting station:', error);
          toast.error(error.response?.data?.message || 'Failed to delete station');
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.chargers-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 20px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #6e8efb;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.logout-btn {
  background: #dc3545;
  border: none;
  padding: 8px 20px;
  font-weight: 500;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c82333;
}

.nav-tabs .nav-link {
  color: #6e8efb;
  font-weight: 500;
  border-radius: 5px 5px 0 0;
}

.nav-tabs .nav-link.active {
  background: #6e8efb;
  color: white;
  border-color: #6e8efb;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #333;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top: 4px solid #6e8efb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.create-form {
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.create-form .card-title {
  color: #6e8efb;
  font-weight: 600;
}

.chargers-table {
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chargers-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
}

.chargers-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.chargers-table tbody tr:hover {
  background: #e9ecef;
  cursor: pointer;
}

.chargers-table td,
.chargers-table th {
  padding: 12px;
  text-align: center;
}

.map-container {
  position: relative;
}

.no-stations {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #666;
}

.popup-content {
  font-size: 0.9rem;
  color: #333;
}

.popup-content h6 {
  margin-bottom: 10px;
  color: #6e8efb;
  font-weight: 600;
}

.popup-content p {
  margin: 5px 0;
}

.modal-content {
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: #6e8efb;
  color: white;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}
</style>