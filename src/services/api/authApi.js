import axios from 'axios';
import { handleApiError } from './api'; // Assuming error handling is defined in api.js

const API_BASE_URL = process.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  /**
   * Login with Google OAuth.
   * @returns {Promise<User>} - The authenticated user.
   */
  loginWithGoogle: async () => {
    try {
      const auth = await new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(token);
          }
        });
      });

      const response = await apiClient.post('/api/auth/google', { token: auth });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Logout the current user.
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user.
   * @returns {Promise<User>} - The current user.
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Update user settings.
   * @param {UserSettings} settings - The new user settings.
   * @returns {Promise<User>} - The updated user.
   */
  updateSettings: async (settings) => {
    try {
      const response = await apiClient.patch('/api/auth/settings', settings);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Refresh the authentication token.
   * @returns {Promise<string>} - The new token.
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/api/auth/refresh-token');
      return response.data.token;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
