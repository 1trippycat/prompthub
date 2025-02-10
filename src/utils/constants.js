// API Constants
export const API_BASE_URL = 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// LLM Types
export const LLM_TYPES = {
  GPT35: 'gpt-3.5-turbo',
  GPT4: 'gpt-4',
  CLAUDE: 'claude-3',
  OTHER: 'other'
};

// Prompt Types
export const PROMPT_TYPES = {
  CHAT: 'chat',
  COMPLETION: 'completion',
  SYSTEM: 'system',
  OTHER: 'other'
};

// Enhancement Types
export const ENHANCEMENT_TYPES = {
  CLARITY: 'clarity',
  SPECIFICITY: 'specificity',
  CONTEXT: 'context',
  CREATIVITY: 'creativity'
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PROMPTS_CACHE: 'prompts_cache',
  SETTINGS: 'settings',
  SITE_INTEGRATIONS: 'site_integrations'
};

// Cache Durations (in hours)
export const CACHE_DURATION = {
  PROMPTS: 24,
  USER: 168 // 1 week
};

// Validation Constants
export const VALIDATION = {
  MAX_PROMPT_LENGTH: 4000,
  MAX_TITLE_LENGTH: 100,
  MAX_CATEGORY_LENGTH: 50,
  MIN_PROMPT_LENGTH: 10
};

// Template Patterns
export const TEMPLATE_PATTERNS = {
  VARIABLE: /{{([^}]+)}}/g
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred. Please check your connection.',
  AUTH: 'Authentication failed. Please log in again.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error occurred. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};