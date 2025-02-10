import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Book, Brain, Target, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const enhancementTypes = {
  clarity: {
    icon: Book,
    title: 'Improve Clarity',
    description: 'Make the prompt more clear and specific',
    systemPrompt: 'Enhance this prompt by making it more clear and specific. Add necessary context and remove ambiguity.'
  },
  context: {
    icon: Brain,
    title: 'Add Context',
    description: 'Add relevant context and background information',
    systemPrompt: 'Enhance this prompt by adding relevant context and background information that will help the AI better understand the request.'
  },
  specificity: {
    icon: Target,
    title: 'Increase Specificity',
    description: 'Make the prompt more focused and detailed',
    systemPrompt: 'Enhance this prompt by making it more specific and detailed. Add constraints and requirements where appropriate.'
  }
};

const LLMEnhancer = ({ prompt = { content: '', llmType: 'gpt-4' }, onUpdate, onClose }) => {
  const [selectedType, setSelectedType] = useState('clarity');
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedVersions, setEnhancedVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!prompt?.content) {
      setError('No prompt content to enhance');
      return;
    }

    setEnhancing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: prompt.content,
          enhancement: enhancementTypes[selectedType].systemPrompt,
          llmType: prompt.llmType || 'gpt-4'
        })
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const data = await response.json();
      
      setEnhancedVersions(prev => [
        ...prev,
        {
          id: Date.now(),
          content: data.enhancedPrompt,
          type: selectedType,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      setError('Failed to enhance prompt. Please try again.');
      console.error('Enhancement error:', error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleApplyEnhancement = () => {
    if (selectedVersion && onUpdate) {
      onUpdate({
        ...prompt,
        content: selectedVersion.content
      });
      onClose?.();
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Enhance Prompt with AI</DialogTitle>
          <DialogDescription>
            Select an enhancement type and let AI improve your prompt
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="enhance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="enhance">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(enhancementTypes).map(([key, type]) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all ${
                      selectedType === key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedType(key)}
                  >
                    <CardHeader>
                      <Icon className="w-8 h-8 text-blue-500" />
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Original Prompt:</h3>
                <p className="text-gray-600">{prompt?.content || 'No prompt content'}</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg bg-red-50 text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {enhancedVersions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {enhancedVersions.map((version, index) => (
                      <Card
                        key={version.id}
                        className={`cursor-pointer transition-all ${
                          selectedVersion?.id === version.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <CardHeader>
                          <CardTitle className="text-sm text-gray-500">
                            Version {enhancedVersions.length - index}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{version.content}</p>
                        </CardContent>
                        <CardFooter>
                          <p className="text-sm text-gray-500">
                            Enhanced using {enhancementTypes[version.type].title}
                          </p>
                        </CardFooter>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {enhancedVersions.map((version, index) => (
                <Card key={version.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm text-gray-500">
                        Version {enhancedVersions.length - index}
                      </CardTitle>
                      <span className="text-sm text-gray-400">
                        {new Date(version.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{version.content}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      Enhanced using {enhancementTypes[version.type].title}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleEnhance}
            disabled={enhancing || !prompt?.content}
          >
            {enhancing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Enhancement
              </>
            )}
          </Button>

          <Button
            onClick={handleApplyEnhancement}
            disabled={!selectedVersion}
          >
            Apply Enhancement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LLMEnhancer;