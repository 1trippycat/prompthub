import axios from 'axios';
import { handleApiError } from './api'; // Assuming error handling is defined in api.js

const API_BASE_URL = process.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Retry logic
apiClient.interceptors.response.use(null, async (error) => {
  const { config, response: { status } } = error;
  if (status === 429 && !config.__isRetryRequest) {
    config.__isRetryRequest = true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    return apiClient(config);
  }
  return Promise.reject(error);
});

export const llmApi = {
  /**
   * Enhance the given content using the specified type and provider.
   * @param {string} content - The content to enhance.
   * @param {string} type - The type of enhancement.
   * @param {string} provider - The provider for the enhancement.
   * @param {object} [options={}] - Additional options for the enhancement.
   * @returns {Promise<EnhancementResult>} - The enhanced result.
   */
  enhancePrompt: async (content, type, provider, options = {}) => {
    try {
      const response = await apiClient.post('/api/llm/enhance', {
        content,
        type,
        provider,
        options
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Validate the given content.
   * @param {string} content - The content to validate.
   * @returns {Promise<ValidationResult>} - The validation result.
   */
  validatePrompt: async (content) => {
    try {
      const response = await apiClient.post('/api/llm/validate', { content });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Generate tags for the given content.
   * @param {string} content - The content to generate tags for.
   * @returns {Promise<string[]>} - The generated tags.
   */
  generateTags: async (content) => {
    try {
      const response = await apiClient.post('/api/llm/auto-tag', { content });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Suggest a category for the given content.
   * @param {string} content - The content to suggest a category for.
   * @returns {Promise<string>} - The suggested category.
   */
  suggestCategory: async (content) => {
    try {
      const response = await apiClient.post('/api/llm/auto-categorize', { content });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

