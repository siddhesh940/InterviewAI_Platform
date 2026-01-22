// src/contexts/GamesContext.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SkillCategory = 'communication' | 'technical';
export type QuestionPool = 'hr' | 'behavioral' | 'technical';
export type GameId = 'fix-bad-answer' | 'keyword-hunt' | 'rephrase-me' | 'answer-builder' | 'keyword-mapping' | 'truth-or-bluff';

export interface GameAttempt {
  id: string;
  gameId: GameId;
  score: number;
  difficulty: DifficultyLevel;
  questionId: string;
  timestamp: string;
  xpEarned: number;
}

export interface GameProgress {
  gameId: GameId;
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  totalXp: number;
  currentLevel: number;
  lastPlayedAt: string | null;
  recentQuestionIds: string[]; // Track last 5 questions to prevent repetition
}

export interface SkillProgress {
  category: SkillCategory;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
}

export interface DailyChallenge {
  id: string;
  gameId: GameId;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  xpReward: number;
  completed: boolean;
  date: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  weeklyActivity: boolean[]; // Last 7 days
}

export interface GamesState {
  gameProgress: Record<GameId, GameProgress>;
  skillProgress: Record<SkillCategory, SkillProgress>;
  dailyChallenge: DailyChallenge | null;
  streak: StreakData;
  totalXp: number;
  overallLevel: number;
  attempts: GameAttempt[];
  selectedDifficulty: DifficultyLevel;
}

interface GamesContextValue extends GamesState {
  // Actions
  recordAttempt: (gameId: GameId, score: number, questionId: string, difficulty: DifficultyLevel) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  getNextQuestion: (gameId: GameId, pool: QuestionPool) => string | null;
  completeDailyChallenge: () => void;
  getGameStats: (gameId: GameId) => GameProgress;
  getOverallStats: () => {
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    totalGamesPlayed: number;
  };
  getDifficultyMultiplier: (difficulty: DifficultyLevel) => number;
  calculateXp: (score: number, difficulty: DifficultyLevel) => number;
}

const STORAGE_KEY = 'interview-ai-games-state';
const XP_PER_LEVEL = 500;
const GAME_IDS: GameId[] = ['fix-bad-answer', 'keyword-hunt', 'rephrase-me', 'answer-builder', 'keyword-mapping', 'truth-or-bluff'];

const initialGameProgress: GameProgress = {
  gameId: 'fix-bad-answer',
  totalAttempts: 0,
  bestScore: 0,
  averageScore: 0,
  totalXp: 0,
  currentLevel: 1,
  lastPlayedAt: null,
  recentQuestionIds: [],
};

const initialSkillProgress: SkillProgress = {
  category: 'communication',
  level: 1,
  currentXp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  totalXp: 0,
};

const defaultState: GamesState = {
  gameProgress: {
    'fix-bad-answer': { ...initialGameProgress, gameId: 'fix-bad-answer' },
    'keyword-hunt': { ...initialGameProgress, gameId: 'keyword-hunt' },
    'rephrase-me': { ...initialGameProgress, gameId: 'rephrase-me' },
    'answer-builder': { ...initialGameProgress, gameId: 'answer-builder' },
    'keyword-mapping': { ...initialGameProgress, gameId: 'keyword-mapping' },
    'truth-or-bluff': { ...initialGameProgress, gameId: 'truth-or-bluff' },
  },
  skillProgress: {
    communication: { ...initialSkillProgress, category: 'communication' },
    technical: { ...initialSkillProgress, category: 'technical' },
  },
  dailyChallenge: null,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    weeklyActivity: [false, false, false, false, false, false, false],
  },
  totalXp: 0,
  overallLevel: 1,
  attempts: [],
  selectedDifficulty: 'intermediate',
};

const GamesContext = createContext<GamesContextValue | null>(null);

// Daily challenge templates
const dailyChallengeTemplates = [
  {
    gameId: 'fix-bad-answer' as GameId,
    title: 'Communication Boost',
    description: 'Transform 3 weak answers into professional responses',
  },
  {
    gameId: 'keyword-hunt' as GameId,
    title: 'Technical Recall',
    description: 'Score 7+ in the Keyword Hunt challenge',
  },
  {
    gameId: 'rephrase-me' as GameId,
    title: 'Language Master',
    description: 'Rephrase 5 sentences professionally',
  },
  {
    gameId: 'answer-builder' as GameId,
    title: 'Structure Pro',
    description: 'Build 3 perfect STAR-structured answers',
  },
  {
    gameId: 'keyword-mapping' as GameId,
    title: 'Concept Connector',
    description: 'Accurately map keywords in 5 answer sets',
  },
  {
    gameId: 'truth-or-bluff' as GameId,
    title: 'Fact Checker',
    description: 'Identify 10 statements correctly',
  },
];

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamesState>(defaultState);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all game IDs have progress initialized
        const mergedGameProgress = { ...defaultState.gameProgress };
        if (parsed.gameProgress) {
          GAME_IDS.forEach(gameId => {
            if (parsed.gameProgress[gameId]) {
              mergedGameProgress[gameId] = { ...defaultState.gameProgress[gameId], ...parsed.gameProgress[gameId] };
            }
          });
        }
        setState(prev => ({ ...prev, ...parsed, gameProgress: mergedGameProgress }));
      }
    } catch (error) {
      console.error('Failed to load games state:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save games state:', error);
      }
    }
  }, [state, mounted]);

  // Generate daily challenge
  useEffect(() => {
    if (mounted) {
      const today = new Date().toISOString().split('T')[0];
      if (!state.dailyChallenge || state.dailyChallenge.date !== today) {
        const template = dailyChallengeTemplates[Math.floor(Math.random() * dailyChallengeTemplates.length)];
        const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        setState(prev => ({
          ...prev,
          dailyChallenge: {
            id: `daily-${today}`,
            gameId: template.gameId,
            title: template.title,
            description: template.description,
            difficulty,
            xpReward: difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 100 : 150,
            completed: false,
            date: today,
          },
        }));
      }
    }
  }, [mounted, state.dailyChallenge]);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    setState(prev => {
      const { lastPlayedDate, currentStreak, longestStreak, weeklyActivity } = prev.streak;
      
      if (lastPlayedDate === today) {
        return prev; // Already played today
      }
      
      let newStreak = 1;
      if (lastPlayedDate === yesterday) {
        newStreak = currentStreak + 1;
      }
      
      // Update weekly activity
      const newWeeklyActivity = [...weeklyActivity.slice(1), true];
      
      return {
        ...prev,
        streak: {
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastPlayedDate: today,
          weeklyActivity: newWeeklyActivity,
        },
      };
    });
  }, []);

  const getDifficultyMultiplier = useCallback((difficulty: DifficultyLevel): number => {
    switch (difficulty) {
      case 'beginner': return 1.0;
      case 'intermediate': return 1.5;
      case 'advanced': return 2.0;
    }
  }, []);

  const calculateXp = useCallback((score: number, difficulty: DifficultyLevel): number => {
    const baseXp = Math.round(score * 10);
    const multiplier = getDifficultyMultiplier(difficulty);
    
return Math.round(baseXp * multiplier);
  }, [getDifficultyMultiplier]);

  const recordAttempt = useCallback((
    gameId: GameId,
    score: number,
    questionId: string,
    difficulty: DifficultyLevel
  ) => {
    const xpEarned = calculateXp(score, difficulty);
    const attempt: GameAttempt = {
      id: `${gameId}-${Date.now()}`,
      gameId,
      score,
      difficulty,
      questionId,
      timestamp: new Date().toISOString(),
      xpEarned,
    };

    setState(prev => {
      const gameProgress = prev.gameProgress[gameId];
      const newTotalAttempts = gameProgress.totalAttempts + 1;
      const newTotalScore = gameProgress.averageScore * gameProgress.totalAttempts + score;
      const newAverageScore = Math.round((newTotalScore / newTotalAttempts) * 10) / 10;
      const newBestScore = Math.max(gameProgress.bestScore, score);
      const newGameXp = gameProgress.totalXp + xpEarned;
      const newGameLevel = Math.floor(newGameXp / XP_PER_LEVEL) + 1;
      
      // Track recent questions (keep last 5)
      const recentQuestionIds = [questionId, ...gameProgress.recentQuestionIds].slice(0, 5);

      // Update skill progress based on game type
      const skillCategory: SkillCategory = gameId === 'keyword-hunt' ? 'technical' : 'communication';
      const skillProgress = prev.skillProgress[skillCategory];
      const newSkillXp = skillProgress.totalXp + xpEarned;
      const newSkillLevel = Math.floor(newSkillXp / XP_PER_LEVEL) + 1;

      // Update total XP and level
      const newTotalXp = prev.totalXp + xpEarned;
      const newOverallLevel = Math.floor(newTotalXp / (XP_PER_LEVEL * 2)) + 1;

      return {
        ...prev,
        gameProgress: {
          ...prev.gameProgress,
          [gameId]: {
            ...gameProgress,
            totalAttempts: newTotalAttempts,
            bestScore: newBestScore,
            averageScore: newAverageScore,
            totalXp: newGameXp,
            currentLevel: newGameLevel,
            lastPlayedAt: new Date().toISOString(),
            recentQuestionIds,
          },
        },
        skillProgress: {
          ...prev.skillProgress,
          [skillCategory]: {
            ...skillProgress,
            totalXp: newSkillXp,
            currentXp: newSkillXp % XP_PER_LEVEL,
            xpToNextLevel: XP_PER_LEVEL - (newSkillXp % XP_PER_LEVEL),
            level: newSkillLevel,
          },
        },
        totalXp: newTotalXp,
        overallLevel: newOverallLevel,
        attempts: [attempt, ...prev.attempts].slice(0, 100), // Keep last 100 attempts
      };
    });

    updateStreak();
  }, [calculateXp, updateStreak]);

const setDifficulty = useCallback((difficulty: DifficultyLevel) => {
  setState(prev => ({ ...prev, selectedDifficulty: difficulty }));
}, []);

const getNextQuestion = useCallback((_gameId: GameId, _pool: QuestionPool): string | null => {
    // This will be implemented in conjunction with question pool data
    // Returns null if no more unique questions available
    return null;
  }, []);

  const completeDailyChallenge = useCallback(() => {
    setState(prev => {
      if (!prev.dailyChallenge || prev.dailyChallenge.completed) {
        return prev;
      }
      
      const xpReward = prev.dailyChallenge.xpReward;
      
return {
        ...prev,
        dailyChallenge: { ...prev.dailyChallenge, completed: true },
        totalXp: prev.totalXp + xpReward,
      };
    });
  }, []);

  const getGameStats = useCallback((gameId: GameId): GameProgress => {
    return state.gameProgress[gameId] || {
      totalAttempts: 0,
      correctAttempts: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: null,
      streakDays: 0,
    };
  }, [state.gameProgress]);

  const getOverallStats = useCallback(() => {
    let totalAttempts = 0;
    let bestScore = 0;
    let totalScore = 0;
    let totalGamesPlayed = 0;

    GAME_IDS.forEach(gameId => {
      const progress = state.gameProgress[gameId];
      // eslint-disable-next-line curly
      if (!progress) return; // Skip if progress doesn't exist for this game
      totalAttempts += progress.totalAttempts;
      bestScore = Math.max(bestScore, progress.bestScore);
      totalScore += progress.averageScore * progress.totalAttempts;
      if (progress.totalAttempts > 0) {totalGamesPlayed++;}
    });

    return {
      totalAttempts,
      bestScore,
      averageScore: totalAttempts > 0 ? Math.round((totalScore / totalAttempts) * 10) / 10 : 0,
      totalGamesPlayed,
    };
  }, [state.gameProgress]);

  const value: GamesContextValue = {
    ...state,
    recordAttempt,
    setDifficulty,
    getNextQuestion,
    completeDailyChallenge,
    getGameStats,
    getOverallStats,
    getDifficultyMultiplier,
    calculateXp,
  };

  return (
    <GamesContext.Provider value={value}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  
return context;
}

// Hook for individual game usage
export function useGameProgress(gameId: GameId) {
  const { gameProgress, recordAttempt, selectedDifficulty, getDifficultyMultiplier, calculateXp } = useGames();
  
  return {
    progress: gameProgress[gameId],
    recordAttempt: (score: number, questionId: string) => recordAttempt(gameId, score, questionId, selectedDifficulty),
    difficulty: selectedDifficulty,
    multiplier: getDifficultyMultiplier(selectedDifficulty),
    calculateXp: (score: number) => calculateXp(score, selectedDifficulty),
  };
}
