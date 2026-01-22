/* eslint-disable curly */
"use client";

import { TabKey } from '@/config/resume-fields';
import { ResumeBuilderData, createDefaultResume } from '@/types/resume-builder';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

// Action Types
type ResumeAction =
  | { type: 'UPDATE_FIELD'; tab: TabKey; name: string; value: string | number; index?: number }
  | { type: 'ADD_ITEM'; tab: TabKey }
  | { type: 'DELETE_ITEM'; tab: TabKey; index: number }
  | { type: 'MOVE_ITEM'; tab: TabKey; index: number; direction: 'up' | 'down' }
  | { type: 'SET_RESUME'; data: ResumeBuilderData }
  | { type: 'SAVE_RESUME' }
  | { type: 'RESET_RESUME' };

// Reducer
function resumeReducer(state: ResumeBuilderData, action: ResumeAction): ResumeBuilderData {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const { tab, name, value, index } = action;
      
      if (index !== undefined && index !== null) {
        // Update array item field (experience, projects, etc.)
        const items = [...(state[tab] as any[])];
        items[index] = { ...items[index], [name]: value };
        
return { ...state, [tab]: items, saved: false };
      } else {
        // Update single object field (contact, summary, skills)
        return {
          ...state,
          [tab]: { ...(state[tab] as object), [name]: value },
          saved: false,
        };
      }
    }

    case 'ADD_ITEM': {
      const items = [...(state[action.tab] as any[]), {}];
      
return { ...state, [action.tab]: items, saved: false };
    }

    case 'DELETE_ITEM': {
      const items = [...(state[action.tab] as any[])];
      items.splice(action.index, 1);
      
return { ...state, [action.tab]: items, saved: false };
    }

    case 'MOVE_ITEM': {
      const items = [...(state[action.tab] as any[])];
      const newIndex = action.direction === 'up' ? action.index - 1 : action.index + 1;
      
      if (newIndex < 0 || newIndex >= items.length) {return state;}
      
      const temp = items[action.index];
      items[action.index] = items[newIndex];
      items[newIndex] = temp;
      
      return { ...state, [action.tab]: items, saved: false };
    }

    case 'SET_RESUME':
      return { ...action.data };

    case 'SAVE_RESUME':
      return { ...state, saved: true };

    case 'RESET_RESUME':
      return createDefaultResume();

    default:
      return state;
  }
}

// Context Type
interface ResumeBuilderContextType {
  resumeData: ResumeBuilderData;
  currentTab: TabKey;
  setCurrentTab: (tab: TabKey) => void;
  updateField: (tab: TabKey, name: string, value: string | number, index?: number) => void;
  addItem: (tab: TabKey) => void;
  deleteItem: (tab: TabKey, index: number) => void;
  moveItem: (tab: TabKey, index: number, direction: 'up' | 'down') => void;
  saveResume: () => void;
  resetResume: () => void;
  setResume: (data: ResumeBuilderData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ResumeBuilderContext = createContext<ResumeBuilderContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'interview-ai-resume-builder';

// Load state from localStorage
const loadState = (): ResumeBuilderData | undefined => {
  if (typeof window === 'undefined') {return undefined;}
  
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {return undefined;}
    
return JSON.parse(serialized);
  } catch (err) {
    console.warn('Error loading resume state from localStorage:', err);
    
return undefined;
  }
};

// Save state to localStorage (debounced)
let saveTimeout: NodeJS.Timeout | null = null;
const saveState = (state: ResumeBuilderData) => {
  if (saveTimeout) {clearTimeout(saveTimeout);}
  
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.info('Resume saved to localStorage');
    } catch (err) {
      console.warn('Error saving resume state to localStorage:', err);
    }
  }, 1000);
};

// Provider Component
export function ResumeBuilderProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, dispatch] = useReducer(resumeReducer, createDefaultResume());
  const [currentTab, setCurrentTab] = React.useState<TabKey>('contact');
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      dispatch({ type: 'SET_RESUME', data: savedState });
    }
    setMounted(true);
  }, []);

  // Check for autofill skills from Skill Autofill page
  useEffect(() => {
    if (!mounted) return;
    
    const autofillSkills = localStorage.getItem('autofill-skills');
    const timestamp = localStorage.getItem('autofill-skills-timestamp');
    
    if (autofillSkills && timestamp) {
      // Only apply if recent (within last 5 minutes)
      const isRecent = Date.now() - parseInt(timestamp) < 5 * 60 * 1000;
      if (isRecent) {
        dispatch({ type: 'UPDATE_FIELD', tab: 'skills', name: 'skills', value: autofillSkills });
        // Clear after applying
        localStorage.removeItem('autofill-skills');
        localStorage.removeItem('autofill-skills-timestamp');
      }
    }
  }, [mounted]);

  // Auto-save on changes (after initial mount)
  useEffect(() => {
    if (mounted) {
      saveState(resumeData);
    }
  }, [resumeData, mounted]);

  const updateField = useCallback((tab: TabKey, name: string, value: string | number, index?: number) => {
    dispatch({ type: 'UPDATE_FIELD', tab, name, value, index });
  }, []);

  const addItem = useCallback((tab: TabKey) => {
    dispatch({ type: 'ADD_ITEM', tab });
  }, []);

  const deleteItem = useCallback((tab: TabKey, index: number) => {
    dispatch({ type: 'DELETE_ITEM', tab, index });
  }, []);

  const moveItem = useCallback((tab: TabKey, index: number, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_ITEM', tab, index, direction });
  }, []);

  const saveResume = useCallback(() => {
    dispatch({ type: 'SAVE_RESUME' });
    saveState({ ...resumeData, saved: true });
  }, [resumeData]);

  const resetResume = useCallback(() => {
    dispatch({ type: 'RESET_RESUME' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setResume = useCallback((data: ResumeBuilderData) => {
    dispatch({ type: 'SET_RESUME', data });
  }, []);

  const value: ResumeBuilderContextType = {
    resumeData,
    currentTab,
    setCurrentTab,
    updateField,
    addItem,
    deleteItem,
    moveItem,
    saveResume,
    resetResume,
    setResume,
    isLoading,
    setIsLoading,
  };

  return (
    <ResumeBuilderContext.Provider value={value}>
      {children}
    </ResumeBuilderContext.Provider>
  );
}

// Hook
export function useResumeBuilderContext() {
  const context = useContext(ResumeBuilderContext);
  if (!context) {
    throw new Error('useResumeBuilderContext must be used within a ResumeBuilderProvider');
  }
  
return context;
}
