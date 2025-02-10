import { storage } from './storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const auth = {
  // Initialize auth state from storage
  async init() {
    const token = await storage.get(AUTH_TOKEN_KEY);
    const userData = await storage.get(USER_KEY);
    return { token, user: userData };
  },

  // Get current auth token
  async getToken() {
    return await storage.get(AUTH_TOKEN_KEY);
  },

  // Get current user data
  async getCurrentUser() {
    return await storage.get(USER_KEY);
  },

  // Handle Google OAuth login
  async loginWithGoogle() {
    try {
      const auth = await chrome.identity.getAuthToken({ interactive: true });
      
      // Get user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await response.json();
      
      // Store auth data
      await storage.setMultiple({
        [AUTH_TOKEN_KEY]: auth.token,
        [USER_KEY]: userData
      });

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const token = await this.getToken();
      if (token) {
        // Revoke Google OAuth token
        await chrome.identity.removeCachedAuthToken({ token });
      }
      
      // Clear stored auth data
      await storage.remove(AUTH_TOKEN_KEY);
      await storage.remove(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch {
      return false;
    }
  },

  // Refresh auth token if needed
  async refreshTokenIfNeeded() {
    try {
      const token = await this.getToken();
      if (!token) return null;

      // Check token validity with Google
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        params: { access_token: token }
      });

      if (!response.ok) {
        // Token is invalid, get a new one
        await chrome.identity.removeCachedAuthToken({ token });
        const newAuth = await chrome.identity.getAuthToken({ interactive: false });
        await storage.set(AUTH_TOKEN_KEY, newAuth.token);
        return newAuth.token;
      }

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};