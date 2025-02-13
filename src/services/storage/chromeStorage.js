// Chrome Storage Service Implementation
export const chromeStorage = {
  async get(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error('Storage get error:', error);
      throw error;
    }
  },

  async set(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  },

  async remove(key) {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  },

  async clear() {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  },

  async getMultiple(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      throw error;
    }
  },

  async setMultiple(items) {
    try {
      await chrome.storage.local.set(items);
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      throw error;
    }
  },

  addListener(callback) {
    chrome.storage.onChanged.addListener(callback);
  },

  removeListener(callback) {
    chrome.storage.onChanged.removeListener(callback);
  }
};
