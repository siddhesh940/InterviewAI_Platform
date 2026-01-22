"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Types
interface TopicProgress {
  attempted: number;
  correct: number;
  lastAttempted: string | null;
}

interface CategoryProgress {
  [topicId: string]: TopicProgress;
}

interface AptitudeProgress {
  quantitative: CategoryProgress;
  "logical-reasoning": CategoryProgress;
  "verbal-ability": CategoryProgress;
}

interface QuickChallengeResult {
  date: string;
  category: string;
  score: number;
  timeSpent: number;
  questionsAttempted: number;
}

interface AptitudeStats {
  totalQuestionsAttempted: number;
  totalCorrect: number;
  weakestTopic: string | null;
  weakestCategory: string | null;
  quickChallengeHistory: QuickChallengeResult[];
}

interface AptitudeContextType {
  progress: AptitudeProgress;
  stats: AptitudeStats;
  recordAnswer: (category: string, topicId: string, isCorrect: boolean) => void;
  getTopicProgress: (category: string, topicId: string) => TopicProgress;
  getCategoryProgress: (category: string) => { attempted: number; correct: number; accuracy: number };
  getOverallAccuracy: () => number;
  getWeakestTopic: () => { topic: string; category: string } | null;
  recordQuickChallenge: (result: Omit<QuickChallengeResult, "date">) => void;
  resetProgress: () => void;
}

const defaultProgress: AptitudeProgress = {
  quantitative: {},
  "logical-reasoning": {},
  "verbal-ability": {},
};

const defaultStats: AptitudeStats = {
  totalQuestionsAttempted: 0,
  totalCorrect: 0,
  weakestTopic: null,
  weakestCategory: null,
  quickChallengeHistory: [],
};

const AptitudeContext = createContext<AptitudeContextType | null>(null);

export function AptitudeProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<AptitudeProgress>(defaultProgress);
  const [stats, setStats] = useState<AptitudeStats>(defaultStats);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    const savedStats = localStorage.getItem("aptitude-stats");
    
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch {
        setProgress(defaultProgress);
      }
    }
    
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch {
        setStats(defaultStats);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage when progress changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aptitude-progress", JSON.stringify(progress));
      localStorage.setItem("aptitude-stats", JSON.stringify(stats));
    }
  }, [progress, stats, isLoaded]);

  const recordAnswer = (category: string, topicId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const categoryKey = category as keyof AptitudeProgress;
      const existingTopic = prev[categoryKey]?.[topicId] || { attempted: 0, correct: 0, lastAttempted: null };
      
      return {
        ...prev,
        [categoryKey]: {
          ...prev[categoryKey],
          [topicId]: {
            attempted: existingTopic.attempted + 1,
            correct: existingTopic.correct + (isCorrect ? 1 : 0),
            lastAttempted: new Date().toISOString(),
          },
        },
      };
    });

    setStats((prev) => ({
      ...prev,
      totalQuestionsAttempted: prev.totalQuestionsAttempted + 1,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
    }));
  };

  const getTopicProgress = (category: string, topicId: string): TopicProgress => {
    const categoryKey = category as keyof AptitudeProgress;
    
return progress[categoryKey]?.[topicId] || { attempted: 0, correct: 0, lastAttempted: null };
  };

  const getCategoryProgress = (category: string) => {
    const categoryKey = category as keyof AptitudeProgress;
    const categoryData = progress[categoryKey] || {};
    
    let totalAttempted = 0;
    let totalCorrect = 0;
    
    Object.values(categoryData).forEach((topic) => {
      totalAttempted += topic.attempted;
      totalCorrect += topic.correct;
    });
    
    return {
      attempted: totalAttempted,
      correct: totalCorrect,
      accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
    };
  };

  const getOverallAccuracy = () => {
    if (stats.totalQuestionsAttempted === 0) {return 0;}
    
return Math.round((stats.totalCorrect / stats.totalQuestionsAttempted) * 100);
  };

  const getWeakestTopic = (): { topic: string; category: string } | null => {
    let weakest: { topic: string; category: string; accuracy: number } | null = null;
    
    const categories = ["quantitative", "logical-reasoning", "verbal-ability"] as const;
    
    categories.forEach((category) => {
      const categoryData = progress[category] || {};
      
      Object.entries(categoryData).forEach(([topicId, topicData]) => {
        if (topicData.attempted >= 5) { // Minimum 5 attempts to be considered
          const accuracy = (topicData.correct / topicData.attempted) * 100;
          if (!weakest || accuracy < weakest.accuracy) {
            weakest = { topic: topicId, category, accuracy };
          }
        }
      });
    });
    
    if (weakest) {
      return { topic: (weakest as { topic: string; category: string; accuracy: number }).topic, category: (weakest as { topic: string; category: string; accuracy: number }).category };
    }
    
return null;
  };

  const recordQuickChallenge = (result: Omit<QuickChallengeResult, "date">) => {
    setStats((prev) => ({
      ...prev,
      quickChallengeHistory: [
        { ...result, date: new Date().toISOString() },
        ...prev.quickChallengeHistory.slice(0, 9), // Keep last 10
      ],
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    setStats(defaultStats);
    localStorage.removeItem("aptitude-progress");
    localStorage.removeItem("aptitude-stats");
  };

  return (
    <AptitudeContext.Provider
      value={{
        progress,
        stats,
        recordAnswer,
        getTopicProgress,
        getCategoryProgress,
        getOverallAccuracy,
        getWeakestTopic,
        recordQuickChallenge,
        resetProgress,
      }}
    >
      {children}
    </AptitudeContext.Provider>
  );
}

export function useAptitude() {
  const context = useContext(AptitudeContext);
  if (!context) {
    throw new Error("useAptitude must be used within an AptitudeProvider");
  }
  
return context;
}
