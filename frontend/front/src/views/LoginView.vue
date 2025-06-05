<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-icon">⚡</div>
        </div>
        <h2>Welcome Back</h2>
        <p class="subtitle">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="login" autocomplete="off" novalidate>
        <div class="input-group">
          <label for="email" class="form-label">Email address</label>
          <div class="input-wrapper">
            <span class="input-icon">📧</span>
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
        </div>
        
        <div class="input-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
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
        </div>
        

        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div class="divider">
        <span>or</span>
      </div>
      
      <div class="register-section">
        <p>Don't have an account?</p>
        <router-link to="/register" class="register-link">Create account</router-link>
      </div>
    </div>
    
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

h2 {
  color: #2d3748;
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: 28px;
}

.subtitle {
  color: #718096;
  margin: 0 0 30px 0;
  font-size: 16px;
}

.input-group {
  margin-bottom: 24px;
}

.form-label {
  color: #4a5568;
  font-weight: 600;
  display: block;
  text-align: left;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 16px;
  z-index: 1;
  opacity: 0.7;
}

.form-control {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  padding: 16px 16px 16px 50px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  background: #f8fafc;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
  background: white;
}

.form-control::placeholder {
  color: #a0aec0;
}



.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 16px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 20px;
  color: #a0aec0;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.register-section {
  text-align: center;
}

.register-section p {
  color: #718096;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid #667eea;
  border-radius: 12px;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 14px;
}

.register-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 480px) {
  .login-box {
    padding: 40px 30px;
    margin: 10px;
  }
  
  .login-container {
    padding: 10px;
  }
  
  h2 {
    font-size: 24px;
  }
  
  .form-control {
    padding: 14px 14px 14px 45px;
  }
  
  .btn-primary {
    padding: 14px 20px;
  }
}
</style>