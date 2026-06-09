/**
 * STACKLY Security Utilities
 * Client-side security helper functions for XSS protection, input sanitization, and CSRF tokens
 */

const SecurityUtils = {
  /**
   * Sanitize HTML input to prevent XSS attacks
   * Uses DOMPurify to strip all HTML tags
   * @param {string} input - User input string
   * @returns {string} Sanitized string with no HTML
   */
  sanitizeHTML: (input) => {
    if (!input) return '';
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  },

  /**
   * Sanitize and validate email address
   * @param {string} email - Email address to validate
   * @returns {string|null} Sanitized email or null if invalid
   */
  sanitizeEmail: (email) => {
    if (!email) return null;

    // Trim and convert to lowercase
    const sanitized = email.trim().toLowerCase();

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
      return null;
    }

    // Additional sanitization - remove any HTML
    return DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
  },

  /**
   * Escape HTML entities to prevent XSS
   * Use this when displaying user content in HTML
   * @param {string} str - String to escape
   * @returns {string} Escaped HTML string
   */
  escapeHTML: (str) => {
    if (!str) return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Generate a cryptographically secure random CSRF token
   * @returns {string} Random hex string token
   */
  generateCSRFToken: () => {
    // Generate 32 random bytes
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    // Convert to hex string
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Store CSRF token in sessionStorage
   * Creates a new token if one doesn't exist
   * @returns {string} The CSRF token
   */
  setCSRFToken: () => {
    const token = SecurityUtils.generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  /**
   * Get existing CSRF token from sessionStorage
   * @returns {string|null} The CSRF token or null
   */
  getCSRFToken: () => {
    return sessionStorage.getItem('csrf_token');
  },

  /**
   * Validate CSRF token against stored token
   * @param {string} token - Token to validate
   * @returns {boolean} True if token is valid
   */
  validateCSRFToken: (token) => {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token && storedToken && token === storedToken;
  },

  /**
   * Validate name input
   * Only allows letters, spaces, hyphens, and apostrophes
   * @param {string} name - Name to validate
   * @returns {object} {valid: boolean, message: string}
   */
  validateName: (name) => {
    if (!name || name.trim().length === 0) {
      return { valid: false, message: 'Name is required' };
    }

    // Remove extra whitespace
    const trimmed = name.trim();

    // Check length
    if (trimmed.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 100) {
      return { valid: false, message: 'Name must be less than 100 characters' };
    }

    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(trimmed)) {
      return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { valid: true, message: '', sanitized: SecurityUtils.sanitizeHTML(trimmed) };
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} {valid: boolean, message: string, strength: string}
   */
  validatePasswordStrength: (password) => {
    if (!password) {
      return { valid: false, message: 'Password is required', strength: 'none' };
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Check length
    if (password.length < minLength) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters long',
        strength: 'weak'
      };
    }

    // Check for uppercase
    if (!hasUpperCase) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter',
        strength: 'weak'
      };
    }

    // Check for lowercase
    if (!hasLowerCase) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter',
        strength: 'weak'
      };
    }

    // Check for number
    if (!hasNumber) {
      return {
        valid: false,
        message: 'Password must contain at least one number',
        strength: 'medium'
      };
    }

    // Check for special character
    if (!hasSpecial) {
      return {
        valid: false,
        message: 'Password must contain at least one special character (!@#$%^&*)',
        strength: 'medium'
      };
    }

    // Calculate strength
    let strength = 'medium';
    if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumber && hasSpecial) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'good';
    }

    return {
      valid: true,
      message: 'Password is strong',
      strength: strength
    };
  },

  /**
   * Sanitize form data object
   * Sanitizes all string values in an object
   * @param {object} data - Form data object
   * @returns {object} Sanitized data object
   */
  sanitizeFormData: (data) => {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeHTML(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  },

  /**
   * Check if current session is valid
   * Verifies CSRF token and session timeout
   * @returns {boolean} True if session is valid
   */
  isSessionValid: () => {
    const csrfToken = SecurityUtils.getCSRFToken();
    const lastActivity = localStorage.getItem('lastActivity');

    if (!csrfToken) {
      return false;
    }

    if (!lastActivity) {
      return false;
    }

    // Check if session has expired (30 minutes = 1800000ms)
    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000;

    if (now - parseInt(lastActivity) > sessionTimeout) {
      return false;
    }

    return true;
  },

  /**
   * Initialize security for current page
   * Sets up CSRF token if not exists
   */
  init: () => {
    // Create CSRF token if it doesn't exist
    if (!SecurityUtils.getCSRFToken()) {
      SecurityUtils.setCSRFToken();
    }

    // Update last activity timestamp
    localStorage.setItem('lastActivity', Date.now());
  }
};

// Auto-initialize on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SecurityUtils.init);
} else {
  SecurityUtils.init();
}
