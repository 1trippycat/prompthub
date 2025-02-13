import { apiClient } from './api';
import { storageService } from '../storage/chromeStorage';

const CACHE_KEY = 'prompts_cache';
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * @typedef {Object} Prompt
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} category
 * @property {string[]} tags
 * @property {string} llmType
 * @property {string} promptType
 * @property {string} userId
 * @property {string[]} templateFields
 * @property {Object[]} versions
 * @property {boolean} isPublic
 * @property {number} usageCount
 */

/**
 * @typedef {Object} Version
 * @property {string} content
 * @property {Date} timestamp
 * @property {string} enhancement
 */

/**
 * @typedef {Object} PromptList
 * @property {Prompt[]} items
 * @property {number} total
 */

export const promptApi = {
  /**
   * Get list of prompts with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<PromptList>}
   */
  async getPrompts(params = {}) {
    const cacheKey = `${CACHE_KEY}_${JSON.stringify(params)}`;
    const cached = await storageService.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/prompts?${queryString}`);

    await storageService.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  },

  /**
   * Get a single prompt by ID
   * @param {string} id - Prompt ID
   * @returns {Promise<Prompt>}
   */
  async getPrompt(id) {
    const cacheKey = `${CACHE_KEY}_${id}`;
    const cached = await storageService.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await apiClient.get(`/prompts/${id}`);

    await storageService.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  },

  /**
   * Create a new prompt
   * @param {Object} data - Prompt data
   * @returns {Promise<Prompt>}
   */
  async createPrompt(data) {
    const response = await apiClient.post('/prompts', data);
    await storageService.clear(CACHE_KEY); // Invalidate cache
    return response;
  },

  /**
   * Update an existing prompt
   * @param {string} id - Prompt ID
   * @param {Object} data - Updated prompt data
   * @returns {Promise<Prompt>}
   */
  async updatePrompt(id, data) {
    const response = await apiClient.patch(`/prompts/${id}`, data);
    await storageService.clear(CACHE_KEY); // Invalidate cache
    return response;
  },

  /**
   * Delete a prompt
   * @param {string} id - Prompt ID
   * @returns {Promise<void>}
   */
  async deletePrompt(id) {
    await apiClient.delete(`/prompts/${id}`);
    await storageService.clear(CACHE_KEY); // Invalidate cache
  },

  /**
   * Get version history for a prompt
   * @param {string} id - Prompt ID
   * @returns {Promise<Version[]>}
   */
  async getVersions(id) {
    const cacheKey = `${CACHE_KEY}_versions_${id}`;
    const cached = await storageService.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await apiClient.get(`/prompts/${id}/versions`);

    await storageService.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  }
};
