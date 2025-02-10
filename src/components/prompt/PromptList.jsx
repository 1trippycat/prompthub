import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Copy, Tag, Bot, MessageSquare } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PromptList = ({ onPromptSelect }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    llmType: 'all',
    promptType: 'all'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        ...filters
      });

      const response = await fetch(`http://localhost:3000/api/prompts?${queryParams}`);
      const data = await response.json();
      
      setPrompts(data.prompts);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm z-10">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search prompts..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg border hover:bg-gray-50"
          >
            <Filter size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <Tag className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.llmType}
                  onValueChange={(value) => handleFilterChange('llmType', value)}
                >
                  <SelectTrigger>
                    <Bot className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="LLM Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All LLMs</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.promptType}
                  onValueChange={(value) => handleFilterChange('promptType', value)}
                >
                  <SelectTrigger>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Prompt Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="function">Function</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeleton loading state
            [...Array(5)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={itemVariants}
                className="h-32 bg-gray-100 rounded-lg animate-pulse"
              />
            ))
          ) : (
            prompts.map((prompt) => (
              <motion.div
                key={prompt._id}
                variants={itemVariants}
                layoutId={prompt._id}
                onClick={() => onPromptSelect(prompt)}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{prompt.title}</CardTitle>
                        <CardDescription>
                          Created {new Date(prompt.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(prompt.content);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{prompt.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {prompt.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {prompt.llmType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {prompt.promptType}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PromptList;