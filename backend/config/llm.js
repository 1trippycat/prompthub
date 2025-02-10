const llmConfig = {
 // Provider settings will be user-configurable
 defaultProvider: 'openai',
 
 // Enhancement types configuration
 enhancementTypes: {
   clarity: {
     instruction: 'Improve the clarity and readability of this prompt while maintaining its original intent.',
     temperature: 0.5
   },
   specificity: {
     instruction: 'Make this prompt more specific and detailed while preserving its core purpose.',
     temperature: 0.6
   },
   context: {
     instruction: 'Add relevant context to this prompt to improve its effectiveness.',
     temperature: 0.7
   },
   creativity: {
     instruction: 'Enhance the creativity of this prompt while keeping its primary objective.',
     temperature: 0.8
   }
 },

 // Prompt validation configuration
 validation: {
   minLength: 10,
   maxLength: 4000,
   forbiddenPatterns: [
     /(<script)|(<iframe)|(<object)/i, // Prevent XSS
     /(DROP TABLE)|(DELETE FROM)|(INSERT INTO)/i // Prevent SQL injection attempts
   ]
 },

 // Error messages
 errors: {
   INVALID_MODEL: 'Invalid model specified',
   INVALID_PROMPT: 'Invalid prompt content',
   API_ERROR: 'LLM API error occurred',
   TIMEOUT: 'Request timed out'
 },

 // Helper functions
 validatePrompt: (prompt) => {
   if (!prompt || typeof prompt !== 'string') {
     return { isValid: false, error: 'Prompt must be a non-empty string' };
   }

   if (prompt.length < llmConfig.validation.minLength) {
     return { isValid: false, error: `Prompt must be at least ${llmConfig.validation.minLength} characters` };
   }

   if (prompt.length > llmConfig.validation.maxLength) {
     return { isValid: false, error: `Prompt must be less than ${llmConfig.validation.maxLength} characters` };
   }

   for (const pattern of llmConfig.validation.forbiddenPatterns) {
     if (pattern.test(prompt)) {
       return { isValid: false, error: 'Prompt contains forbidden patterns' };
     }
   }

   return { isValid: true };
 }
};

export default llmConfig;