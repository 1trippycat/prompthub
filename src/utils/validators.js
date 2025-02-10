import { VALIDATION, LLM_TYPES, PROMPT_TYPES } from './constants';

export const validators = {
  // Validate prompt data
  validatePrompt: (promptData) => {
    const errors = {};

    // Check title
    if (!promptData.title) {
      errors.title = 'Title is required';
    } else if (promptData.title.length > VALIDATION.MAX_TITLE_LENGTH) {
      errors.title = `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`;
    }

    // Check content
    if (!promptData.content) {
      errors.content = 'Content is required';
    } else if (promptData.content.length < VALIDATION.MIN_PROMPT_LENGTH) {
      errors.content = `Content must be at least ${VALIDATION.MIN_PROMPT_LENGTH} characters`;
    } else if (promptData.content.length > VALIDATION.MAX_PROMPT_LENGTH) {
      errors.content = `Content must be less than ${VALIDATION.MAX_PROMPT_LENGTH} characters`;
    }

    // Check category length if provided
    if (promptData.category && promptData.category.length > VALIDATION.MAX_CATEGORY_LENGTH) {
      errors.category = `Category must be less than ${VALIDATION.MAX_CATEGORY_LENGTH} characters`;
    }

    // Validate LLM type
    if (!Object.values(LLM_TYPES).includes(promptData.llmType)) {
      errors.llmType = 'Invalid LLM type';
    }

    // Validate prompt type
    if (!Object.values(PROMPT_TYPES).includes(promptData.promptType)) {
      errors.promptType = 'Invalid prompt type';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate template syntax
  validateTemplate: (content) => {
    const errors = [];
    
    // Check for unmatched template variables
    const openBraces = (content.match(/{{/g) || []).length;
    const closeBraces = (content.match(/}}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('Unmatched template braces');
    }

    // Check for empty variables
    const emptyVarMatch = content.match(/{{\s*}}/g);
    if (emptyVarMatch) {
      errors.push('Empty template variables found');
    }

    // Check for invalid characters in variable names
    const varNameRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = varNameRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
        errors.push(`Invalid variable name: ${varName}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate enhancement request
  validateEnhancement: (content, enhancementType) => {
    const errors = {};

    if (!content) {
      errors.content = 'Content is required for enhancement';
    }

    if (!enhancementType) {
      errors.enhancementType = 'Enhancement type is required';
    }

    if (content && content.length > VALIDATION.MAX_PROMPT_LENGTH) {
      errors.content = `Content must be less than ${VALIDATION.MAX_PROMPT_LENGTH} characters`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Utility function to validate object against schema
  validateSchema: (data, schema) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (value) {
        if (rules.min && value.length < rules.min) {
          errors[field] = `${field} must be at least ${rules.min} characters`;
        }

        if (rules.max && value.length > rules.max) {
          errors[field] = `${field} must be less than ${rules.max} characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors[field] = `${field} must be one of: ${rules.enum.join(', ')}`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};