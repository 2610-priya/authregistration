/**
 * Auth and Form Validation Utilities (Integrated with Java Spring Boot API)
 */

const API_BASE_URL = 'https://authregistration.onrender.com/api/auth';

const STORAGE_KEYS = {
  SESSION: 'auth_system_current_session'
};

/**
 * Validates format of an email address.
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Evaluates password strength and returns rating details
 * @param {string} password 
 * @returns {Object} strength assessment
 */
function checkPasswordStrength(password) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password)
  };

  // Score computation
  if (checks.length) score++;
  if (checks.hasUpper && checks.hasLower) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;

  let label = 'Very Weak';
  let colorClass = 'strength-weak';
  
  if (score === 2) {
    label = 'Fair';
    colorClass = 'strength-fair';
  } else if (score === 3) {
    label = 'Good';
    colorClass = 'strength-good';
  } else if (score === 4) {
    label = 'Strong';
    colorClass = 'strength-strong';
  }

  return {
    score,
    checks,
    label,
    colorClass
  };
}

/**
 * Client REST API Requests
 */
const db = {
  /**
   * Registers a new user via Spring Boot REST Endpoint
   * @param {Object} userData 
   * @returns {Promise<Object>} status report { success: boolean, message: string }
   */
  async registerUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Registration successful!', user: data };
      } else {
        // Return server validation error or generic alert
        return { success: false, message: data.error || Object.values(data).join(', ') || 'Registration failed.' };
      }
    } catch (e) {
      console.error('API Error:', e);
      return { success: false, message: 'Connection refused. Please ensure the backend server is running.' };
    }
  },

  /**
   * Validates credentials against Spring Boot REST Endpoint
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object|null>} The auth response DTO if valid, null otherwise
   */
  async validateUser(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        return data; // Returns { id, fullName, email, token }
      } else {
        // Return null on failure, details are handled inside response error parameter
        return { error: data.error || 'Invalid email or password.' };
      }
    } catch (e) {
      console.error('API Error:', e);
      return { error: 'Connection refused. Please ensure the backend server is running.' };
    }
  },

  /**
   * Queries the database user count
   * @returns {Promise<number>}
   */
  async getTotalUsersCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/count`);
      const data = await response.json();
      return data.count || 0;
    } catch (e) {
      console.error('API Error:', e);
      return 0;
    }
  }
};

/**
 * Session State APIs (Session storage determines if user is logged in)
 */
const session = {
  /**
   * Creates an active session for a logged-in user
   * @param {Object} user 
   * @param {boolean} rememberMe - If true, saves to localStorage, else sessionStorage
   */
  start(user, rememberMe = false) {
    const userSession = {
      ...user,
      loginTime: new Date().toISOString()
    };
    
    const sessionStr = JSON.stringify(userSession);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.SESSION, sessionStr);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionStr);
    }
  },

  /**
   * Gets current active session (checks both sessionStorage and localStorage)
   * @returns {Object|null}
   */
  get() {
    let sessionRaw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionRaw) {
      sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionRaw) {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionRaw);
      }
    }
    return sessionRaw ? JSON.parse(sessionRaw) : null;
  },

  /**
   * Ends current user session
   */
  destroy() {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Helper that acts as a router auth guard.
   * If user session doesn't exist, redirect to login page.
   */
  guardDashboard() {
    if (!this.get()) {
      window.location.replace('login.html');
    }
  },

  /**
   * Helper that checks if user is logged in already.
   * If yes, redirect away from login/register to dashboard page.
   */
  guardAuthPages() {
    if (this.get()) {
      window.location.replace('dashboard.html');
    }
  }
};
