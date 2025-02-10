// services/api.js
const BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Prompt Management
  async getPrompts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/prompts?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch prompts');
    return response.json();
  },

  async createPrompt(promptData) {
    const response = await fetch(`${BASE_URL}/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData)
    });
    if (!response.ok) throw new Error('Failed to create prompt');
    return response.json();
  },

  async updatePrompt(id, promptData) {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData)
    });
    if (!response.ok) throw new Error('Failed to update prompt');
    return response.json();
  },

  async deletePrompt(id) {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete prompt');
    return response.json();
  },

  // LLM Enhancement
  async enhancePrompt(content, enhancementType, llmType = 'gpt-4') {
    const response = await fetch(`${BASE_URL}/enhance-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        enhancement: enhancementType,
        llmType
      })
    });
    if (!response.ok) throw new Error('Failed to enhance prompt');
    return response.json();
  },

  // Auth Management
  async getCurrentUser() {
    const user = await chrome.storage.local.get('user');
    return user.user;
  },

  async login() {
    try {
      const auth = await chrome.identity.getAuthToken({ interactive: true });
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to get user info');
      const user = await response.json();
      await chrome.storage.local.set({ user });
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  async logout() {
    await chrome.storage.local.remove('user');
  }
};

// Error handling middleware
export const withErrorHandling = (apiCall) => async (...args) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    console.error('API Error:', error);
    // You can add more error handling logic here
    throw error;
  }
};

// Cached API calls with error handling
export const apiWithCache = {
  getPrompts: withErrorHandling(async (params) => {
    const cacheKey = `prompts-${JSON.stringify(params)}`;
    const cached = await chrome.storage.local.get(cacheKey);
    
    if (cached[cacheKey]) {
      // Return cached data immediately
      return cached[cacheKey];
    }

    // Fetch fresh data
    const data = await api.getPrompts(params);
    
    // Cache the results
    await chrome.storage.local.set({
      [cacheKey]: {
        ...data,
        cachedAt: Date.now()
      }
    });

    return data;
  })
};

// WebSocket connection for real-time updates (if needed)
export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return this.ws;
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 1000 * Math.pow(2, this.reconnectAttempts));
    }
  }

  subscribe(event, callback) {
    if (!this.ws) this.connect();
    this.ws.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
      if (data.event === event) {
        callback(data.payload);
      }
    });
  }

  send(event, data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(JSON.stringify({ event, data }));
  }
}

export const wsClient = new WebSocketClient();