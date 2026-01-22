// src/contexts/InterviewResourcesContext.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RecentlyViewed {
  id: string;
  viewedAt: string;
}

interface ResourcesState {
  bookmarkedPDFs: string[];
  recentlyViewed: RecentlyViewed[];
}

interface ResourcesContextValue extends ResourcesState {
  toggleBookmark: (pdfId: string) => void;
  isBookmarked: (pdfId: string) => boolean;
  addToRecentlyViewed: (pdfId: string) => void;
  getRecentlyViewedIds: () => string[];
  clearRecentlyViewed: () => void;
  bookmarkCount: number;
}

const defaultState: ResourcesState = {
  bookmarkedPDFs: [],
  recentlyViewed: [],
};

const ResourcesContext = createContext<ResourcesContextValue | null>(null);

const STORAGE_KEY = 'interview-ai-resources-state';
const MAX_RECENT_ITEMS = 10;

export function InterviewResourcesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResourcesState>(defaultState);
  const [mounted, setMounted] = useState(false);

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
      console.error('Failed to load resources state:', error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save resources state:', error);
      }
    }
  }, [state, mounted]);

  const toggleBookmark = useCallback((pdfId: string) => {
    setState(prev => {
      const isCurrentlyBookmarked = prev.bookmarkedPDFs.includes(pdfId);
      
return {
        ...prev,
        bookmarkedPDFs: isCurrentlyBookmarked
          ? prev.bookmarkedPDFs.filter(id => id !== pdfId)
          : [...prev.bookmarkedPDFs, pdfId],
      };
    });
  }, []);

  const isBookmarked = useCallback((pdfId: string) => {
    return state.bookmarkedPDFs.includes(pdfId);
  }, [state.bookmarkedPDFs]);

  const addToRecentlyViewed = useCallback((pdfId: string) => {
    setState(prev => {
      const filtered = prev.recentlyViewed.filter(item => item.id !== pdfId);
      const updated = [
        { id: pdfId, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_RECENT_ITEMS);
      
      return {
        ...prev,
        recentlyViewed: updated,
      };
    });
  }, []);

  const getRecentlyViewedIds = useCallback(() => {
    return state.recentlyViewed.map(item => item.id);
  }, [state.recentlyViewed]);

  const clearRecentlyViewed = useCallback(() => {
    setState(prev => ({
      ...prev,
      recentlyViewed: [],
    }));
  }, []);

  const value: ResourcesContextValue = {
    ...state,
    toggleBookmark,
    isBookmarked,
    addToRecentlyViewed,
    getRecentlyViewedIds,
    clearRecentlyViewed,
    bookmarkCount: state.bookmarkedPDFs.length,
  };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
}

export function useInterviewResources() {
  const context = useContext(ResourcesContext);
  if (!context) {
    return {
      bookmarkedPDFs: [],
      recentlyViewed: [],
      toggleBookmark: () => {},
      isBookmarked: () => false,
      addToRecentlyViewed: () => {},
      getRecentlyViewedIds: () => [],
      clearRecentlyViewed: () => {},
      bookmarkCount: 0,
    } as ResourcesContextValue;
  }
  
return context;
}
