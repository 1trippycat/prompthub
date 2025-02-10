import { useState, useCallback } from 'react';

export const useTemplates = () => {
  const [templateFields, setTemplateFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [error, setError] = useState(null);

  const extractTemplateFields = useCallback((content) => {
    const regex = /{{([^}]+)}}/g;
    const fields = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      fields.push(match[1].trim());
    }
    
    setTemplateFields([...new Set(fields)]);
    return fields;
  }, []);

  const updateFieldValue = useCallback((field, value) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const fillTemplate = useCallback((content) => {
    let filledContent = content;
    Object.entries(fieldValues).forEach(([field, value]) => {
      const regex = new RegExp(`{{\\s*${field}\\s*}}`, 'g');
      filledContent = filledContent.replace(regex, value);
    });
    return filledContent;
  }, [fieldValues]);

  const resetFields = useCallback(() => {
    setFieldValues({});
    setTemplateFields([]);
    setError(null);
  }, []);

  const validateTemplate = useCallback((content) => {
    try {
      const fields = extractTemplateFields(content);
      const missingFields = fields.filter(field => !fieldValues[field]);
      if (missingFields.length > 0) {
        setError(`Missing values for fields: ${missingFields.join(', ')}`);
        return false;
      }
      setError(null);
      return true;
    } catch (err) {
      setError('Template validation failed');
      return false;
    }
  }, [extractTemplateFields, fieldValues]);

  return {
    templateFields,
    fieldValues,
    error,
    extractTemplateFields,
    updateFieldValue,
    fillTemplate,
    resetFields,
    validateTemplate
  };
};