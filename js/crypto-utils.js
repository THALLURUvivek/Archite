/**
 * STACKLY Crypto Utilities
 * Uses built-in Web Crypto API (no external dependencies)
 * Works offline and doesn't require CDN
 */

const CryptoUtils = {
  /**
   * Hash password using SHA-256 (built-in browser API)
   * @param {string} password - Password to hash
   * @returns {Promise<string>} Hashed password as hex string
   */
  hashPassword: async (password) => {
    // Convert password to array buffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  },

  /**
   * Verify password against hash
   * @param {string} password - Password to verify
   * @param {string} hash - Stored hash to compare against
   * @returns {Promise<boolean>} True if password matches
   */
  verifyPassword: async (password, hash) => {
    const passwordHash = await CryptoUtils.hashPassword(password);
    return passwordHash === hash;
  },

  /**
   * Basic HTML sanitization without external library
   * @param {string} input - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeHTML: (input) => {
    if (!input) return '';

    // Create a temporary div element
    const temp = document.createElement('div');
    temp.textContent = input; // This escapes HTML automatically
    return temp.innerHTML;
  },

  /**
   * Validate and sanitize email
   * @param {string} email - Email to validate
   * @returns {string|null} Sanitized email or null if invalid
   */
  sanitizeEmail: (email) => {
    if (!email) return null;

    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
      return null;
    }

    return CryptoUtils.sanitizeHTML(sanitized);
  },

  /**
   * Validate name
   * @param {string} name - Name to validate
   * @returns {object} Validation result
   */
  validateName: (name) => {
    if (!name || name.trim().length === 0) {
      return { valid: false, message: 'Name is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 100) {
      return { valid: false, message: 'Name must be less than 100 characters' };
    }

    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(trimmed)) {
      return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { valid: true, message: '', sanitized: CryptoUtils.sanitizeHTML(trimmed) };
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result
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

    if (password.length < minLength) {
      return { valid: false, message: 'Password must be at least 8 characters long', strength: 'weak' };
    }

    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter', strength: 'weak' };
    }

    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter', strength: 'weak' };
    }

    if (!hasNumber) {
      return { valid: false, message: 'Password must contain at least one number', strength: 'medium' };
    }

    if (!hasSpecial) {
      return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*)', strength: 'medium' };
    }

    let strength = 'medium';
    if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumber && hasSpecial) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'good';
    }

    return { valid: true, message: 'Password is strong', strength: strength };
  },

  /**
   * Generate CSRF token
   * @returns {string} Random token
   */
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Set CSRF token in session
   * @returns {string} The token
   */
  setCSRFToken: () => {
    const token = CryptoUtils.generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  /**
   * Get CSRF token
   * @returns {string|null} The token
   */
  getCSRFToken: () => {
    return sessionStorage.getItem('csrf_token');
  }
};
