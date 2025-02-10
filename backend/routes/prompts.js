import express from 'express';
import authMiddleware from '../middleware/auth.js';
import validateMiddleware from '../middleware/validate.js';
import promptService from '../services/promptService.js';

const router = express.Router();

// List prompts with pagination and filters
router.get('/',
  authMiddleware.verifyToken,
  validateMiddleware.validatePagination,
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const prompts = await promptService.getPrompts(req.user.id, page, limit);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }
);

// Create new prompt
router.post('/',
  authMiddleware.verifyToken,
  validateMiddleware.validatePrompt,
  async (req, res, next) => {
    try {
      const newPrompt = await promptService.createPrompt(req.user.id, req.body);
      res.status(201).json(newPrompt);
    } catch (error) {
      next(error);
    }
  }
);

// Get single prompt
router.get('/:id',
  authMiddleware.verifyToken,
  async (req, res, next) => {
    try {
      const prompt = await promptService.getPromptById(req.params.id);
      res.json(prompt);
    } catch (error) {
      next(error);
    }
  }
);

// Update prompt
router.put('/:id',
  authMiddleware.verifyToken,
  validateMiddleware.validatePrompt,
  async (req, res, next) => {
    try {
      const updatedPrompt = await promptService.updatePrompt(req.params.id, req.body);
      res.json(updatedPrompt);
    } catch (error) {
      next(error);
    }
  }
);

// Delete prompt
router.delete('/:id',
  authMiddleware.verifyToken,
  async (req, res, next) => {
    try {
      await promptService.deletePrompt(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// Get prompt versions
router.get('/:id/versions',
  authMiddleware.verifyToken,
  async (req, res, next) => {
    try {
      const versions = await promptService.getPromptVersions(req.params.id);
      res.json(versions);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
