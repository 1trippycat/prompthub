import React, { createContext, useContext, useState } from 'react';

const PromptContext = createContext();

export const PromptProvider = ({ children }) => {
  // TODO: Implement context provider

  const value = {
    // Add context values
  };

  return (
    <PromptContext.Provider value={value}>
      {children}
    <PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};
