<template>
  <div class="container mt-5">
    <h2>Charging Stations</h2>
    <button class="btn btn-danger mb-3" @click="logout">Logout</button>
    <table class="table table-bordered">
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
      try {
        const response = await axios.get('http://localhost:5000/api/stations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.stations = response.data;
      } catch (error) {
        console.error('Error fetching stations:', error); // Add this to use the error variable
        toast.error('Failed to fetch stations');
        this.$router.push('/');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    },
  },
};
</script>