"use client";

import {
  calculateOverallProgress,
  calculateSkillProgress,
  getSkillById,
  getSkillLevel,
  SkillLevel,
  skills
} from '@/data/soft-skills-data';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface QuizResult {
  skillId: string;
  score: number;
  total: number;
  level: SkillLevel;
  completedAt: string;
}

interface TipAction {
  tipId: string;
  action: 'applied' | 'saved';
  timestamp: string;
}

interface SoftSkillsState {
  // Checklist state
  completedChecklist: Record<string, string[]>; // skillId -> array of completed item ids
  // Video state
  watchedVideos: Record<string, string[]>; // skillId -> array of watched video ids
  // Quiz state
  quizResults: Record<string, QuizResult>; // skillId -> latest result
  // Tips state
  tipActions: TipAction[];
  // Overall score (calculated)
  overallScore: number;
  // Skill scores
  skillScores: Record<string, number>;
}

interface SoftSkillsContextValue extends SoftSkillsState {
  // Checklist actions
  toggleChecklistItem: (skillId: string, itemId: string) => void;
  isChecklistItemCompleted: (skillId: string, itemId: string) => boolean;
  getSkillChecklistProgress: (skillId: string) => number;
  // Video actions
  markVideoWatched: (skillId: string, videoId: string) => void;
  isVideoWatched: (skillId: string, videoId: string) => boolean;
  // Quiz actions
  submitQuizResult: (skillId: string, score: number, total: number) => void;
  getQuizResult: (skillId: string) => QuizResult | null;
  isQuizCompleted: (skillId: string) => boolean;
  // Tips actions
  markTipApplied: (tipId: string) => void;
  saveTipForLater: (tipId: string) => void;
  isTipApplied: (tipId: string) => boolean;
  isTipSaved: (tipId: string) => boolean;
  getSavedTips: () => TipAction[];
  // Progress
  getWeightedSkillProgress: (skillId: string) => number;
  // Overall
  resetProgress: () => void;
}

const defaultState: SoftSkillsState = {
  completedChecklist: {},
  watchedVideos: {},
  quizResults: {},
  tipActions: [],
  overallScore: 0,
  skillScores: {},
};

const SoftSkillsContext = createContext<SoftSkillsContextValue | null>(null);

const STORAGE_KEY = 'interview-ai-soft-skills-progress';

export function SoftSkillsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SoftSkillsState>(defaultState);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (error) {
      console.error('Failed to load soft skills progress:', error);
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save soft skills progress:', error);
      }
    }
  }, [state, mounted]);

  // Recalculate scores when checklist, videos, or quizzes change
  useEffect(() => {
    if (mounted) {
      const skillScores: Record<string, number> = {};
      const completedQuizzes: Record<string, boolean> = {};
      
      // Build completed quizzes map
      Object.keys(state.quizResults).forEach(skillId => {
        completedQuizzes[skillId] = true;
      });
      
      // Calculate weighted progress for each skill
      skills.forEach(skill => {
        const skillData = getSkillById(skill.id);
        if (skillData) {
          skillScores[skill.id] = calculateSkillProgress(skillData, {
            watchedVideos: state.watchedVideos[skill.id] || [],
            completedChecklist: state.completedChecklist[skill.id] || [],
            quizCompleted: !!state.quizResults[skill.id],
          });
        }
      });
      
      const overallScore = calculateOverallProgress(
        state.completedChecklist,
        state.watchedVideos,
        completedQuizzes
      );
      
      setState(prev => ({
        ...prev,
        skillScores,
        overallScore,
      }));
    }
  }, [state.completedChecklist, state.watchedVideos, state.quizResults, mounted]);

  const toggleChecklistItem = useCallback((skillId: string, itemId: string) => {
    setState(prev => {
      const current = prev.completedChecklist[skillId] || [];
      const isCompleted = current.includes(itemId);
      
      return {
        ...prev,
        completedChecklist: {
          ...prev.completedChecklist,
          [skillId]: isCompleted
            ? current.filter(id => id !== itemId)
            : [...current, itemId],
        },
      };
    });
  }, []);

  const isChecklistItemCompleted = useCallback((skillId: string, itemId: string) => {
    return (state.completedChecklist[skillId] || []).includes(itemId);
  }, [state.completedChecklist]);

  const getSkillChecklistProgress = useCallback((skillId: string) => {
    const skill = getSkillById(skillId);
    if (!skill) {return 0;}
    const completed = state.completedChecklist[skillId] || [];
    const totalItems = skill.checklist.length;
    
return totalItems > 0 ? Math.round((completed.length / totalItems) * 100) : 0;
  }, [state.completedChecklist]);

  // Video tracking
  const markVideoWatched = useCallback((skillId: string, videoId: string) => {
    setState(prev => {
      const current = prev.watchedVideos[skillId] || [];
      if (current.includes(videoId)) {return prev;} // Already watched
      
      return {
        ...prev,
        watchedVideos: {
          ...prev.watchedVideos,
          [skillId]: [...current, videoId],
        },
      };
    });
  }, []);

  const isVideoWatched = useCallback((skillId: string, videoId: string) => {
    return (state.watchedVideos[skillId] || []).includes(videoId);
  }, [state.watchedVideos]);

  // Quiz completion check
  const isQuizCompleted = useCallback((skillId: string) => {
    return !!state.quizResults[skillId];
  }, [state.quizResults]);

  // Get weighted progress for a specific skill
  const getWeightedSkillProgress = useCallback((skillId: string) => {
    const skill = getSkillById(skillId);
    if (!skill) {return 0;}
    
    return calculateSkillProgress(skill, {
      watchedVideos: state.watchedVideos[skillId] || [],
      completedChecklist: state.completedChecklist[skillId] || [],
      quizCompleted: !!state.quizResults[skillId],
    });
  }, [state.watchedVideos, state.completedChecklist, state.quizResults]);

  const submitQuizResult = useCallback((skillId: string, score: number, total: number) => {
    const level = getSkillLevel(score, total);
    const result: QuizResult = {
      skillId,
      score,
      total,
      level,
      completedAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [skillId]: result,
      },
    }));
  }, []);

  const getQuizResult = useCallback((skillId: string): QuizResult | null => {
    return state.quizResults[skillId] || null;
  }, [state.quizResults]);

  const markTipApplied = useCallback((tipId: string) => {
    setState(prev => ({
      ...prev,
      tipActions: [
        ...prev.tipActions.filter(t => t.tipId !== tipId),
        { tipId, action: 'applied', timestamp: new Date().toISOString() },
      ],
    }));
  }, []);

  const saveTipForLater = useCallback((tipId: string) => {
    setState(prev => {
      const existing = prev.tipActions.find(t => t.tipId === tipId);
      if (existing?.action === 'saved') {
        // Toggle off if already saved
        return {
          ...prev,
          tipActions: prev.tipActions.filter(t => t.tipId !== tipId),
        };
      }

      return {
        ...prev,
        tipActions: [
          ...prev.tipActions.filter(t => t.tipId !== tipId),
          { tipId, action: 'saved', timestamp: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const isTipApplied = useCallback((tipId: string) => {
    return state.tipActions.some(t => t.tipId === tipId && t.action === 'applied');
  }, [state.tipActions]);

  const isTipSaved = useCallback((tipId: string) => {
    return state.tipActions.some(t => t.tipId === tipId && t.action === 'saved');
  }, [state.tipActions]);

  const getSavedTips = useCallback(() => {
    return state.tipActions.filter(t => t.action === 'saved');
  }, [state.tipActions]);

  const resetProgress = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: SoftSkillsContextValue = {
    ...state,
    toggleChecklistItem,
    isChecklistItemCompleted,
    getSkillChecklistProgress,
    markVideoWatched,
    isVideoWatched,
    submitQuizResult,
    getQuizResult,
    isQuizCompleted,
    markTipApplied,
    saveTipForLater,
    isTipApplied,
    isTipSaved,
    getSavedTips,
    getWeightedSkillProgress,
    resetProgress,
  };

  return (
    <SoftSkillsContext.Provider value={value}>
      {children}
    </SoftSkillsContext.Provider>
  );
}

export function useSoftSkills() {
  const context = useContext(SoftSkillsContext);
  if (!context) {
    // Return safe defaults if context not available
    return {
      completedChecklist: {},
      watchedVideos: {},
      quizResults: {},
      tipActions: [],
      overallScore: 0,
      skillScores: {},
      toggleChecklistItem: () => {},
      isChecklistItemCompleted: () => false,
      getSkillChecklistProgress: () => 0,
      markVideoWatched: () => {},
      isVideoWatched: () => false,
      submitQuizResult: () => {},
      getQuizResult: () => null,
      isQuizCompleted: () => false,
      markTipApplied: () => {},
      saveTipForLater: () => {},
      isTipApplied: () => false,
      isTipSaved: () => false,
      getSavedTips: () => [],
      getWeightedSkillProgress: () => 0,
      resetProgress: () => {},
    } as SoftSkillsContextValue;
  }

  return context;
}
