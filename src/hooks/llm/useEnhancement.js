import { useState } from 'react';
import { llmApi } from '../../services/api/llmApi';

const useEnhancement = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const enhance = async (content, type) => {
    setIsEnhancing(true);
    setError(null);
    setResult(null);

    try {
      const response = await llmApi.enhancePrompt(content, type);
      setResult(response);
    } catch (err) {
      setError(err.message || 'An error occurred while enhancing the prompt.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const supportedEnhancements = ['clarity', 'specificity', 'context', 'creativity'];

  return {
    enhance,
    isEnhancing,
    error,
    result,
    supportedEnhancements
  };
};

export default useEnhancement;
