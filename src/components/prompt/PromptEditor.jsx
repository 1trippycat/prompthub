import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const CreatePromptScreen = ({ onSave, initialPrompt = null }) => {
  const [prompt, setPrompt] = useState({
    title: '',
    content: '',
    category: 'writing',
    llmType: 'gpt-3.5-turbo',
    promptType: 'chat',
    ...initialPrompt
  });

  const [enhancing, setEnhancing] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [templateValues, setTemplateValues] = useState({});

  // Highlight template variables in real-time
  useEffect(() => {
    const highlighted = prompt.content.replace(
      /{{([^}]+)}}/g,
      '<span class="bg-blue-100 text-blue-800 px-1 rounded">{{$1}}</span>'
    );
    setHighlightedContent(highlighted);
  }, [prompt.content]);

  const handleEnhancePrompt = async () => {
    setEnhancing(true);
    try {
      const response = await fetch('http://localhost:3000/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: prompt.content,
          enhancement: 'Make it more specific and effective'
        })
      });
      
      const data = await response.json();
      setPrompt(prev => ({ ...prev, content: data.enhancedPrompt }));
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleSave = async () => {
    const templateFields = prompt.content.match(/{{([^}]+)}}/g)?.map(field => 
      field.replace(/[{}]/g, '')
    ) || [];
    
    await onSave({
      ...prompt,
      templateFields
    });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      const fields = prompt.content.match(/{{([^}]+)}}/g) || [];
      const initialValues = {};
      fields.forEach(field => {
        const cleanField = field.replace(/[{}]/g, '');
        initialValues[cleanField] = '';
      });
      setTemplateValues(initialValues);
    }
  };

  const getPreviewContent = () => {
    let content = prompt.content;
    Object.entries(templateValues).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `{{${key}}}`);
    });
    return content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col gap-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialPrompt ? 'Edit Prompt' : 'Create New Prompt'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={togglePreview}
            className="flex items-center gap-2"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Prompt
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Prompt Title"
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
            value={prompt.title}
            onChange={e => setPrompt(prev => ({ ...prev, title: e.target.value }))}
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              value={prompt.category}
              onValueChange={value => setPrompt(prev => ({ ...prev, category: value }))}
            >
              <option value="writing">Writing</option>
              <option value="coding">Coding</option>
              <option value="other">Other</option>
            </Select>

            <Select
              value={prompt.llmType}
              onValueChange={value => setPrompt(prev => ({ ...prev, llmType: value }))}
            >
              <option value="gpt-3.5-turbo">GPT-3.5</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude 3</option>
              <option value="local">Local</option>
              <option value="other">Other</option>
            </Select>

            <Select
              value={prompt.promptType}
              onValueChange={value => setPrompt(prev => ({ ...prev, promptType: value }))}
            >
              <option value="chat">Chat</option>
              <option value="completion">Completion</option>
              <option value="function">Function</option>
              <option value="system">System</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="relative">
            <textarea
              placeholder="Enter your prompt here... Use {{variable}} for template fields"
              className="w-full h-64 p-4 rounded-lg border focus:ring-2 focus:ring-blue-400 font-mono"
              value={prompt.content}
              onChange={e => setPrompt(prev => ({ ...prev, content: e.target.value }))}
            />
            <Button
              onClick={handleEnhancePrompt}
              disabled={enhancing}
              className="absolute bottom-4 right-4 flex items-center gap-2"
            >
              {enhancing ? (
                <Sparkles className="animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Enhance with AI
            </Button>
          </div>

          <div
            className="p-4 rounded-lg bg-gray-50 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border bg-white">
            <h3 className="font-medium mb-4">Fill in template values:</h3>
            {Object.keys(templateValues).map(field => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field}:
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
                  value={templateValues[field]}
                  onChange={e => setTemplateValues(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border bg-white">
            <h3 className="font-medium mb-2">Preview:</h3>
            <p className="whitespace-pre-wrap">{getPreviewContent()}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreatePromptScreen;