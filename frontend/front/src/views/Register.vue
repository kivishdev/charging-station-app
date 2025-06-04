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
            minlength="6"
          />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="Confirm your password"
            autocomplete="new-password"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
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

// Flexible base URL with localhost fallback
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
    };
  },
  methods: {
    validateForm() {
      // Check if all fields are filled
      if (!this.email.trim() || !this.password || !this.confirmPassword) {
        toast.error('Please fill in all fields');
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.trim())) {
        toast.error('Please enter a valid email address');
        return false;
      }

      // Check password length
      if (this.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }

      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }

      return true;
    },

    async register() {
      // Prevent multiple submissions
      if (this.loading) return;
      
      // Validate form before proceeding
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        console.log('API Base URL:', axios.defaults.baseURL);
        
        const response = await axios.post('/api/auth/register', {
          email: this.email.trim().toLowerCase(), // Normalize email
          password: this.password,
        });

        console.log('Registration response:', response);

        // Handle success (200 or 201 status)
        if (response.status === 200 || response.status === 201) {
          toast.success('Registration successful! Redirecting to login...');
          
          // Clear form data
          this.email = '';
          this.password = '';
          this.confirmPassword = '';

          // Redirect to login
          setTimeout(() => {
            this.$router.push('/');
          }, 1500);
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        
        // Specific error messages
        if (error.response?.status === 400) {
          toast.error('Email already exists');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } finally {
        // Always clear passwords for security
        this.password = '';
        this.confirmPassword = '';
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