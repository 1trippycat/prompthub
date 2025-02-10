import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const usePrompts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPrompts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getPrompts(params);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPrompt = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const { prompts } = await api.getPrompts({ id });
      return prompts[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPrompt = useCallback(async (promptData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createPrompt(promptData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePrompt = useCallback(async (id, promptData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.updatePrompt(id, promptData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePrompt = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.deletePrompt(id);
      return response;
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
    getPrompts,
    getPrompt,
    createPrompt,
    updatePrompt,
    deletePrompt
  };
};