import OpenAI from 'openai';
import llmConfig from '../config/llm.js';
import { APIError } from '../middleware/error.js';

class LLMService {
  constructor() {
    this.providers = {
      openai: null
    };
  }

  initializeProvider(provider, apiKey) {
    switch (provider) {
      case 'openai':
        this.providers.openai = new OpenAI({
          apiKey,
          baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
        });
        break;
      default:
        throw new APIError(400, 'Unsupported LLM provider');
    }
  }

  async enhancePrompt(content, enhancement, provider = 'openai', model = 'gpt-4') {
    try {
      if (!llmConfig.enhancementTypes[enhancement]) {
        throw new APIError(400, 'Invalid enhancement type');
      }

      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const enhancementConfig = llmConfig.enhancementTypes[enhancement];
      
      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: enhancementConfig.instruction
          },
          {
            role: "user",
            content
          }
        ],
        temperature: enhancementConfig.temperature
      });

      return {
        enhancedPrompt: completion.choices[0].message.content,
        usage: completion.usage
      };
    } catch (error) {
      throw new APIError(500, 'Error enhancing prompt: ' + error.message);
    }
  }

  async generateTags(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Generate relevant tags for the following prompt. Return them as a comma-separated list."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      return completion.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    } catch (error) {
      throw new APIError(500, 'Error generating tags: ' + error.message);
    }
  }

  async suggestCategory(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Suggest a single category for the following prompt. Return only the category name."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      throw new APIError(500, 'Error suggesting category: ' + error.message);
    }
  }

  validatePrompt(content) {
    return llmConfig.validatePrompt(content);
  }

  async analyzePromptQuality(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Analyze the following prompt and provide feedback on its quality. Consider clarity, specificity, and potential improvements."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7
      });

      return {
        analysis: completion.choices[0].message.content,
        usage: completion.usage
      };
    } catch (error) {
      throw new APIError(500, 'Error analyzing prompt: ' + error.message);
    }
  }
}

export default new LLMService();