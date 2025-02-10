import { TEMPLATE_PATTERNS } from './constants';
import { validators } from './validators';

export const templateParser = {
  // Extract all variables from a template
  extractVariables: (template) => {
    const variables = new Set();
    let match;

    while ((match = TEMPLATE_PATTERNS.VARIABLE.exec(template)) !== null) {
      variables.add(match[1].trim());
    }

    return Array.from(variables);
  },

  // Parse and validate a template
  parseTemplate: (template) => {
    const validation = validators.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    return {
      variables: templateParser.extractVariables(template)
    };
  },

  // Fill template with values
  fillTemplate: (template, values) => {
    let result = template;

    // Replace variables
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  },

  // Preview template with values
  previewTemplate: (template, values) => {
    try {
      return templateParser.fillTemplate(template, values);
    } catch (error) {
      return `Preview Error: ${error.message}`;
    }
  },

  // Validate template values
  validateTemplateValues: (template, values) => {
    const variables = templateParser.extractVariables(template);
    const missing = variables.filter(variable => !(variable in values));
    
    return {
      isValid: missing.length === 0,
      missing
    };
  }
};