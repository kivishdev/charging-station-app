<template>
  <div class="chargers-container">
    <!-- Header -->
    <header class="header-bar">
      <h2>Charging Stations</h2>
      <button class="btn btn-danger logout-btn" @click="logout">Logout</button>
    </header>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading stations...</p>
    </div>

    <!-- Stations Table -->
    <table v-else class="table table-bordered chargers-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Status</th>
          <th>Power Output (kW)</th>
          <th>Connector Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="station in stations" :key="station._id">
          <td>{{ station.name }}</td>
          <td>{{ station.location.latitude }}, {{ station.location.longitude }}</td>
          <td>{{ station.status }}</td>
          <td>{{ station.powerOutput }}</td>
          <td>{{ station.connectorType }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'ChargersView',
  data() {
    return {
      stations: [],
      loading: false,
    };
  },
  async created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/');
    } else {
      await this.fetchStations();
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

.chargers-table td, .chargers-table th {
  padding: 12px;
  text-align: center;
}
</style>