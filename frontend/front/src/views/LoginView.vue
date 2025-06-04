<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login" autocomplete="off" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter your email"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
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
            autocomplete="new-password"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p class="mt-3 text-center">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';

// Flexible base URL configuration with localhost fallback
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      // Prevent multiple submissions
      if (this.loading) return;
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Validate inputs
      if (!this.email.trim() || !this.password.trim()) {
        toast.error('Please fill in all fields');
        return;
      }
      
      // Validate email format
      if (!emailRegex.test(this.email.trim())) {
        toast.error('Please enter a valid email address');
        return;
      }

      this.loading = true;
      try {
        console.log('API Base URL:', axios.defaults.baseURL);
        
        const response = await axios.post('/api/auth/login', {
          email: this.email.trim().toLowerCase(), // Normalize email
          password: this.password,
        });

        console.log('Login response:', response);

        // Handle different token response formats
        const token = response.data?.token || 
                     response.data?.accessToken || 
                     response.data?.access_token;
        
        if (token) {
          localStorage.setItem('token', token);
          toast.success('Login successful! Redirecting...');
          
          // Redirect after delay
          setTimeout(() => {
            this.$router.push('/chargers');
          }, 1000);
        } else {
          throw new Error('Authentication token missing in response');
        }
      } catch (error) {
        console.error('Login error:', error);
        
        // Specific error messages
        if (error.response?.status === 401) {
          toast.error('Invalid email or password');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Login failed. Please try again.');
        }
      } finally {
        // Always clear password for security
        this.password = '';
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
  display: block;
  text-align: left;
  margin-bottom: 5px;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  transition: border-color 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #6e8efb;
  box-shadow: 0 0 5px rgba(110, 142, 251, 0.3);
  outline: none;
}

.mb-3 {
  margin-bottom: 1rem;
}

.btn-primary {
  background: #6e8efb;
  border: none;
  padding: 10px;
  font-weight: 500;
  transition: background 0.3s;
  border-radius: 5px;
  cursor: pointer;
}

.w-100 {
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: #5a7af8;
}

.btn-primary:disabled {
  background: #a6b8ff;
  cursor: not-allowed;
}

.mt-3 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

p {
  color: #666;
  margin: 0;
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