"use client";

import { ResumeBuilderData } from "@/types/resume-builder";
import { useAuth, useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";

const API_BASE = "/api/resume-builder";

interface SavedResumeRecord {
  id: string;
  user_id: string;
  title: string;
  resume_data: ResumeBuilderData;
  created_at: string;
  updated_at: string;
}

export function useResumeStorage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save resume to Supabase
  const saveToCloud = useCallback(
    async (resumeData: ResumeBuilderData, title?: string): Promise<SavedResumeRecord | null> => {
      if (!isSignedIn || !user) {
        setError("Please sign in to save your resume to the cloud.");

        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title || resumeData.contact.name || "My Resume",
            resumeData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save resume");
        }

        const data = await response.json();

        return data.resume;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to save resume";
        setError(errorMessage);
        console.error("Save to cloud error:", err);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, user]
  );

  // Update existing resume
  const updateResume = useCallback(
    async (id: string, resumeData: ResumeBuilderData, title?: string): Promise<SavedResumeRecord | null> => {
      if (!isSignedIn || !user) {
        setError("Please sign in to update your resume.");

        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            resumeData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update resume");
        }

        const data = await response.json();

        return data.resume;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update resume";
        setError(errorMessage);
        console.error("Update resume error:", err);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, user]
  );

  // Load all user resumes
  const loadResumes = useCallback(async (): Promise<SavedResumeRecord[]> => {
    if (!isSignedIn || !user) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_BASE);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load resumes");
      }

      const data = await response.json();

      return data.resumes || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load resumes";
      setError(errorMessage);
      console.error("Load resumes error:", err);

      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user]);

  // Load single resume by ID
  const loadResume = useCallback(
    async (id: string): Promise<SavedResumeRecord | null> => {
      if (!isSignedIn || !user) {
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load resume");
        }

        const data = await response.json();

        return data.resume;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load resume";
        setError(errorMessage);
        console.error("Load resume error:", err);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, user]
  );

  // Delete resume
  const deleteResume = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isSignedIn || !user) {
        setError("Please sign in to delete your resume.");

        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete resume");
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete resume";
        setError(errorMessage);
        console.error("Delete resume error:", err);

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, user]
  );

  return {
    isLoading,
    error,
    isSignedIn,
    saveToCloud,
    updateResume,
    loadResumes,
    loadResume,
    deleteResume,
    clearError: () => setError(null),
  };
}
