/**
 * API Client utility with automatic token expiration handling
 */

const BASE_URL = import.meta.env?.VITE_BASE_URL || 'http://localhost:5000';

/**
 * Makes an authenticated API request with automatic logout on token expiration
 * @param {string} endpoint - API endpoint (e.g., '/api/recipes/saved')
 * @param {object} options - Fetch options
 * @param {Function} onTokenExpired - Callback to handle token expiration (logout)
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(endpoint, options = {}, onTokenExpired = null) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      
      if (data.message === 'Token expired' || data.message === 'Invalid token') {
        console.log('Token expired or invalid, clearing session...');
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenTimestamp');
        
        // Call the logout callback if provided
        if (onTokenExpired) {
          onTokenExpired();
        }
        
        // Throw a specific error
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Makes a regular API request without authentication
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
