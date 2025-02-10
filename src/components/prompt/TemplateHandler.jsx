import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard, ClipboardCheck } from 'lucide-react';

const TemplateHandler = ({ prompt = { content: '', title: 'Untitled Prompt' }, onClose }) => {
  const [templateFields, setTemplateFields] = useState({});
  const [currentField, setCurrentField] = useState(0);
  const [previewContent, setPreviewContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prompt?.content) {
      setError('No prompt content available');
      return;
    }

    try {
      // Extract template fields from prompt content
      const fields = [...(prompt.content.match(/{{([^}]+)}}/g) || [])].map(match => ({
        name: match.replace(/[{}]/g, ''),
        value: '',
        range: [match.index, match.index + match.length]
      }));

      const initialFields = {};
      fields.forEach(field => {
        initialFields[field.name] = '';
      });
      setTemplateFields(initialFields);
      setPreviewContent(prompt.content);
    } catch (err) {
      setError('Error processing template fields');
      console.error('Template processing error:', err);
    }
  }, [prompt?.content]);

  const handleFieldChange = (fieldName, value) => {
    try {
      setTemplateFields(prev => ({
        ...prev,
        [fieldName]: value
      }));

      // Update preview content
      let newContent = prompt?.content || '';
      Object.entries({ ...templateFields, [fieldName]: value }).forEach(([key, val]) => {
        newContent = newContent.replace(
          new RegExp(`{{${key}}}`, 'g'),
          val || `{{${key}}}`
        );
      });
      setPreviewContent(newContent);
    } catch (err) {
      setError('Error updating template field');
      console.error('Field update error:', err);
    }
  };

  const handleNext = () => {
    if (currentField < Object.keys(templateFields).length - 1) {
      setCurrentField(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentField > 0) {
      setCurrentField(prev => prev - 1);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      console.error('Copy error:', err);
    }
  };

  const fieldNames = Object.keys(templateFields);
  const currentFieldName = fieldNames[currentField];
  const hasFields = fieldNames.length > 0;

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Fill Template Values - {prompt?.title}</DialogTitle>
          <DialogDescription>
            {hasFields 
              ? 'Fill in the values for each template field to generate your prompt'
              : 'This prompt has no template fields to fill'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 text-red-600 rounded-md"
              >
                {error}
              </motion.div>
            )}

            {hasFields ? (
              <motion.div
                key={currentFieldName}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {currentFieldName}:
                  </label>
                  <Input
                    type="text"
                    value={templateFields[currentFieldName] || ''}
                    onChange={(e) => handleFieldChange(currentFieldName, e.target.value)}
                    placeholder={`Enter value for ${currentFieldName}`}
                    autoFocus
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Preview:</label>
                  <div className="mt-2 p-4 rounded-lg bg-gray-50 whitespace-pre-wrap">
                    {previewContent || 'No preview available'}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-lg bg-gray-50">
                <p>{prompt?.content || 'No content available'}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex justify-between">
          {hasFields ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentField === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentField === fieldNames.length - 1}
              >
                Next
              </Button>
            </div>
          ) : null}

          <Button
            variant="default"
            className="ml-auto"
            onClick={handleCopy}
            disabled={!prompt?.content}
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4 mr-2" />
                Copy {hasFields ? 'Result' : 'Prompt'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateHandler;