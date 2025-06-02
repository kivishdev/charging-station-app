<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p class="mt-3 text-center">
        Already have an account? <router-link to="/">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    async register() {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);
        // Store the email temporarily to use on the login page after logout
        localStorage.setItem('lastRegisteredEmail', this.email);
        toast.success('Registration successful! Redirecting...');
        setTimeout(() => {
          this.$router.push('/chargers');
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  color: #6e8efb;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-label {
  color: #333;
  font-weight: 500;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #6e8efb;
  box-shadow: 0 0 5px rgba(110, 142, 251, 0.3);
  outline: none;
}

.btn-primary {
  background: #6e8efb;
  border: none;
  padding: 10px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5a7af8;
}

.btn-primary:disabled {
  background: #a6b8ff;
  cursor: not-allowed;
}

p {
  color: #666;
}

a {
  color: #6e8efb;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>