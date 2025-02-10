export const storage = {
 // Get a value from storage
 async get(key) {
   try {
     const result = await chrome.storage.local.get(key);
     return result[key];
   } catch (error) {
     console.error('Storage get error:', error);
     throw error;
   }
 },

 // Set a value in storage
 async set(key, value) {
   try {
     await chrome.storage.local.set({ [key]: value });
   } catch (error) {
     console.error('Storage set error:', error);
     throw error;
   }
 },

 // Remove a value from storage
 async remove(key) {
   try {
     await chrome.storage.local.remove(key);
   } catch (error) {
     console.error('Storage remove error:', error);
     throw error;
   }
 },

 // Clear all extension storage
 async clear() {
   try {
     await chrome.storage.local.clear();
   } catch (error) {
     console.error('Storage clear error:', error);
     throw error;
   }
 },

 // Get multiple values from storage
 async getMultiple(keys) {
   try {
     const result = await chrome.storage.local.get(keys);
     return result;
   } catch (error) {
     console.error('Storage getMultiple error:', error);
     throw error;
   }
 },

 // Set multiple values in storage
 async setMultiple(items) {
   try {
     await chrome.storage.local.set(items);
   } catch (error) {
     console.error('Storage setMultiple error:', error);
     throw error;
   }
 },

 // Watch for changes to storage
 addChangeListener(callback) {
   chrome.storage.onChanged.addListener((changes, areaName) => {
     if (areaName === 'local') {
       callback(changes);
     }
   });
 },

 // Helper method for handling cached data
 async getWithExpiry(key, expiryHours = 24) {
   const stored = await this.get(key);
   if (!stored) return null;

   const { value, timestamp } = stored;
   const now = new Date().getTime();
   const expiryTime = expiryHours * 60 * 60 * 1000;

   if (now - timestamp > expiryTime) {
     await this.remove(key);
     return null;
   }

   return value;
 },

 // Store data with expiration
 async setWithExpiry(key, value, expiryHours = 24) {
   const data = {
     value,
     timestamp: new Date().getTime()
   };
   await this.set(key, data);
 }
};