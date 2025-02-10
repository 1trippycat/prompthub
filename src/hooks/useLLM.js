import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enhancePrompt = useCallback(async (content, enhancementType, llmType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.enhancePrompt(content, enhancementType, llmType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validatePrompt = useCallback(async (content, llmType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.enhancePrompt(content, 'validate', llmType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    enhancePrompt,
    validatePrompt
  };
};