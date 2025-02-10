import Prompt from '../models/Prompt.js';
import { APIError } from '../middleware/error.js';

class PromptService {
  async getPrompts(query, pagination) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skipAmount = (page - 1) * limit;

      const prompts = await Prompt.find(query)
        .skip(skipAmount)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Prompt.countDocuments(query);

      return {
        prompts,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new APIError(500, 'Error fetching prompts');
    }
  }

  async createPrompt(promptData) {
    try {
      const prompt = await Prompt.create(promptData);
      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error creating prompt');
    }
  }

  async getPromptById(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error fetching prompt');
    }
  }

  async updatePrompt(id, userId, updateData) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      // Store current version before updating
      await prompt.addVersion(prompt.content);

      // Update prompt
      Object.assign(prompt, updateData);
      await prompt.save();

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error updating prompt');
    }
  }

  async deletePrompt(id, userId) {
    try {
      const prompt = await Prompt.findOneAndDelete({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error deleting prompt');
    }
  }

  async getPromptVersions(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt.versions;
    } catch (error) {
      throw new APIError(500, 'Error fetching prompt versions');
    }
  }

  async restoreVersion(id, userId, versionId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      const version = prompt.versions.id(versionId);
      if (!version) {
        throw new APIError(404, 'Version not found');
      }

      // Store current version before restoring
      await prompt.addVersion(prompt.content);
      
      // Restore the selected version
      prompt.content = version.content;
      await prompt.save();

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error restoring prompt version');
    }
  }

  async getCategories(userId) {
    try {
      return await Prompt.distinct('category', { userId });
    } catch (error) {
      throw new APIError(500, 'Error fetching categories');
    }
  }

  async getTags(userId) {
    try {
      return await Prompt.distinct('tags', { userId });
    } catch (error) {
      throw new APIError(500, 'Error fetching tags');
    }
  }

  async getPopularPrompts(limit = 10) {
    try {
      return await Prompt.findPopular(limit);
    } catch (error) {
      throw new APIError(500, 'Error fetching popular prompts');
    }
  }

  async incrementUsage(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      await prompt.incrementUsage();
      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error incrementing prompt usage');
    }
  }
}

export default new PromptService();