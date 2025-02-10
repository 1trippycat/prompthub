import express from 'express';
import authMiddleware from '../middleware/auth.js';
import validateMiddleware from '../middleware/validate.js';
import { APIError } from '../middleware/error.js';
import llmConfig from '../config/llm.js';
import OpenAI from 'openai';

const router = express.Router();

// Apply auth middleware to all LLM routes
router.use(authMiddleware.verifyToken);

// Initialize OpenAI with user's API key
const getOpenAI = (apiKey) => {
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
  });
};

// Enhance prompt
router.post('/enhance',
  validateMiddleware.validateEnhancement,
  async (req, res, next) => {
    try {
      const { content, enhancement, model = 'gpt-4' } = req.body;
      
      if (!llmConfig.enhancementTypes[enhancement]) {
        throw new APIError(400, 'Invalid enhancement type');
      }

      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: llmConfig.enhancementTypes[enhancement].instruction
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: llmConfig.enhancementTypes[enhancement].temperature
      });

      res.status(200).json({
        status: 'success',
        data: {
          enhancedPrompt: completion.choices[0].message.content,
          usage: completion.usage
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Validate prompt
router.post('/validate',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const validation = llmConfig.validatePrompt(content);

      res.status(200).json({
        status: 'success',
        data: validation
      });
    } catch (error) {
      next(error);
    }
  }
);

// Auto-tag prompt
router.post('/auto-tag',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content, model = 'gpt-4' } = req.body;
      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
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

      const tags = completion.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      res.status(200).json({
        status: 'success',
        data: { tags }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Auto-categorize prompt
router.post('/auto-categorize',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content, model = 'gpt-4' } = req.body;
      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
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

      const category = completion.choices[0].message.content.trim();

      res.status(200).json({
        status: 'success',
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;