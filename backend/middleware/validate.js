import { APIError } from './error.js';
import llmConfig from '../config/llm.js';

const validateMiddleware = {
  // Validate request body exists
  validateBody: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new APIError(400, 'Request body is required'));
    }
    next();
  },

  // Validate prompt data
  validatePrompt: (req, res, next) => {
    const { content, title, category, llmType, promptType } = req.body;

    // Check required fields
    if (!content || !title) {
      return next(new APIError(400, 'Content and title are required'));
    }

    // Validate prompt content
    const validationResult = llmConfig.validatePrompt(content);
    if (!validationResult.isValid) {
      return next(new APIError(400, validationResult.error));
    }

    // Validate title length
    if (title.length > 100) {
      return next(new APIError(400, 'Title must be less than 100 characters'));
    }

    // Validate category if provided
    if (category && category.length > 50) {
      return next(new APIError(400, 'Category must be less than 50 characters'));
    }

    // Validate LLM type if provided
    const validLLMTypes = ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'local', 'other'];
    if (llmType && !validLLMTypes.includes(llmType)) {
      return next(new APIError(400, 'Invalid LLM type'));
    }

    // Validate prompt type if provided
    const validPromptTypes = ['chat', 'completion', 'function', 'system', 'other'];
    if (promptType && !validPromptTypes.includes(promptType)) {
      return next(new APIError(400, 'Invalid prompt type'));
    }

    next();
  },

  // Validate enhancement request
  validateEnhancement: (req, res, next) => {
    const { content, enhancement } = req.body;

    if (!content || !enhancement) {
      return next(new APIError(400, 'Content and enhancement type are required'));
    }

    const validEnhancements = ['clarity', 'specificity', 'context', 'creativity'];
    if (!validEnhancements.includes(enhancement)) {
      return next(new APIError(400, 'Invalid enhancement type'));
    }

    const validationResult = llmConfig.validatePrompt(content);
    if (!validationResult.isValid) {
      return next(new APIError(400, validationResult.error));
    }

    next();
  },

  // Validate pagination parameters
  validatePagination: (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
      return next(new APIError(400, 'Page must be greater than 0'));
    }

    if (limit < 1 || limit > 100) {
      return next(new APIError(400, 'Limit must be between 1 and 100'));
    }

    req.pagination = { page, limit };
    next();
  },

  // Validate MongoDB ID
  validateMongoId: (req, res, next) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new APIError(400, 'Invalid ID format'));
    }
    next();
  },

  // Validate template syntax
  validateTemplate: (req, res, next) => {
    const { content } = req.body;
    if (!content) {
      return next(new APIError(400, 'Template content is required'));
    }

    // Check for balanced template variables
    const openBraces = (content.match(/{{/g) || []).length;
    const closeBraces = (content.match(/}}/g) || []).length;

    if (openBraces !== closeBraces) {
      return next(new APIError(400, 'Template has unmatched braces'));
    }

    // Check for empty variables
    if (content.match(/{{\s*}}/g)) {
      return next(new APIError(400, 'Template contains empty variables'));
    }

    // Check for valid variable names
    const varNameRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = varNameRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
        return next(new APIError(400, `Invalid variable name: ${varName}`));
      }
    }

    next();
  }
};

export default validateMiddleware;