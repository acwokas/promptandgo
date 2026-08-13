import { useState, useEffect, useCallback } from 'react';

export interface SavedPrompt {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  savedAt: number;
}

const STORAGE_KEY = 'pag_saved_prompts';

export const useSavedPrompts = () => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  // Load saved prompts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedPrompts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved prompts:', error);
    }
  }, []);

  // Save a prompt
  const savePrompt = useCallback((prompt: Omit<SavedPrompt, 'savedAt'>) => {
    setSavedPrompts((prev) => {
      // Check if already saved
      if (prev.some((p) => p.id === prompt.id)) {
        return prev;
      }
      
      const newPrompt: SavedPrompt = {
        ...prompt,
        savedAt: Date.now(),
      };
      
      const updated = [newPrompt, ...prev];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save prompt:', error);
      }
      
      return updated;
    });
  }, []);

  // Remove a saved prompt
  const removePrompt = useCallback((promptId: string) => {
    setSavedPrompts((prev) => {
      const updated = prev.filter((p) => p.id !== promptId);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to remove prompt:', error);
      }
      
      return updated;
    });
  }, []);

  // Check if a prompt is saved
  const isPromptSaved = useCallback((promptId: string) => {
    return savedPrompts.some((p) => p.id === promptId);
  }, [savedPrompts]);

  // Toggle save status
  const toggleSavePrompt = useCallback((prompt: Omit<SavedPrompt, 'savedAt'>) => {
    if (isPromptSaved(prompt.id)) {
      removePrompt(prompt.id);
      return false;
    } else {
      savePrompt(prompt);
      return true;
    }
  }, [isPromptSaved, removePrompt, savePrompt]);

  // Clear all saved prompts
  const clearAllSaved = useCallback(() => {
    setSavedPrompts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear saved prompts:', error);
    }
  }, []);

  return {
    savedPrompts,
    savePrompt,
    removePrompt,
    isPromptSaved,
    toggleSavePrompt,
    clearAllSaved,
    count: savedPrompts.length,
  };
};