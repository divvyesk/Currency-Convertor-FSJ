// Theme Management
class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.themeIcon = document.getElementById('theme-icon');
      this.init();
    }
  
    init() {
      // Load saved theme or default to dark
      const savedTheme = localStorage.getItem('theme') || 'dark';
      this.setTheme(savedTheme);
  
      // Add event listener
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    }
  
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      if (this.themeIcon) {
        this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      
      // Add rotation effect
      if (this.themeToggle) {
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          this.themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
      }
    }
  }
  
  // Initialize theme manager
  const themeManager = new ThemeManager();
  
  // DOM Elements
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const passwordStrengthDisplay = document.getElementById("password-strength");
  
  // Toggle between Login and Signup forms
  function showLogin() {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
  }
  
  function showSignup() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
  }
  
  if (loginBtn) loginBtn.addEventListener("click", showLogin);
  if (signupBtn) signupBtn.addEventListener("click", showSignup);
  
  // Password visibility toggles
  function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
      toggle.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        const icon = toggle.querySelector("i");
        icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
      });
    }
  }
  
  setupPasswordToggle("toggle-login-password", "login-password");
  setupPasswordToggle("toggle-signup-password", "signup-password");
  setupPasswordToggle("toggle-confirm-password", "confirm-password");
  
  // Password strength checker
  function checkPasswordStrength(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (score <= 2) return { strength: "Weak", class: "weak" };
    if (score <= 3) return { strength: "Medium", class: "medium" };
    if (score >= 4) return { strength: "Strong", class: "strong" };
  }
  
  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Setup password strength monitoring
  const signupPasswordInput = document.getElementById("signup-password");
  if (signupPasswordInput && passwordStrengthDisplay) {
    signupPasswordInput.addEventListener("input", (e) => {
      const password = e.target.value;
      if (password) {
        const { strength, class: strengthClass } = checkPasswordStrength(password);
        passwordStrengthDisplay.textContent = `Password Strength: ${strength}`;
        passwordStrengthDisplay.className = `password-strength ${strengthClass}`;
      } else {
        passwordStrengthDisplay.textContent = "";
        passwordStrengthDisplay.className = "password-strength";
      }
    });
  }
  
  // Form validation and submission
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 80px;
        background: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
          <span>${message}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
  
  // Add CSS for notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Handle Login Form
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
      
      // Validation
      if (!email) {
        showNotification("Please enter your email address.", "error");
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }
      
      if (!password) {
        showNotification("Please enter your password.", "error");
        return;
      }
      
      if (password.length < 8) {
        showNotification("Password must be at least 8 characters long.", "error");
        return;
      }
      
      // Simulate login process with loading state
      const submitBtn = loginForm.querySelector('.btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification("Login successful! Redirecting to converter...", "success");
        
        setTimeout(() => {
          window.location.href = "converter.html";
        }, 1500);
      }, 1000);
    });
  }
  
  // Handle Signup Form
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const termsCheckbox = document.getElementById("terms-checkbox");
      
      // Validation
      if (!name) {
        showNotification("Please enter your full name.", "error");
        return;
      }
      
      if (name.length < 2) {
        showNotification("Name must be at least 2 characters long.", "error");
        return;
      }
      
      if (!email) {
        showNotification("Please enter your email address.", "error");
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }
      
      if (!password) {
        showNotification("Please enter a password.", "error");
        return;
      }
      
      const passwordCheck = checkPasswordStrength(password);
      if (passwordCheck.strength !== "Strong") {
        showNotification("Please create a stronger password with uppercase, lowercase, numbers, and special characters.", "error");
        return;
      }
      
      if (!confirmPassword) {
        showNotification("Please confirm your password.", "error");
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification("Passwords do not match. Please try again.", "error");
        return;
      }
      
      if (!termsCheckbox.checked) {
        showNotification("Please accept the Terms of Service to continue.", "error");
        return;
      }
      
      // Simulate signup process with loading state
      const submitBtn = signupForm.querySelector('.btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification("Account created successfully! You can now sign in.", "success");
        
        // Reset form and switch to login
        signupForm.reset();
        passwordStrengthDisplay.textContent = "";
        passwordStrengthDisplay.className = "password-strength";
        
        setTimeout(() => {
          showLogin();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }, 1500);
    });
  }
  
  // Add smooth transitions and interactions
  document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    }, 100);
    
    // Add hover effects to inputs
    const inputs = document.querySelectorAll('.input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
      });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn, .toggle-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      });
    });
  });
