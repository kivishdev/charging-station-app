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

axios.defaults.baseURL=import.meta.env.VUE_APP_API_BASE_URL;

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
      // Validate inputs before making request
      if (!this.email.trim() || !this.password.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      this.loading = true;
      try {
        const response = await axios.post(`${import.meta.env.VUE_API_BASE_URL}/api/auth/login`, {
          email: this.email.trim(),
          password: this.password,
        });

        // Check if response contains token
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful! Redirecting...');
          
          // Use nextTick to ensure DOM updates before navigation
          this.$nextTick(() => {
            setTimeout(() => {
              this.$router.push('/chargers');
            }, 1000);
          });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        // Better error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Login failed. Please try again.';
        toast.error(errorMessage);
        
        // Clear password on error for security
        this.password = '';
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