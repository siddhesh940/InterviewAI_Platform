import { FuturePrediction, ResumeUpload, TimeMachineData, TimeMachineResponse } from '@/types/time-machine';
import { useCallback, useState } from 'react';

export const useTimeMachine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<FuturePrediction | null>(null);
  const [resumeUpload, setResumeUpload] = useState<ResumeUpload | null>(null);

  const uploadResume = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Handle 422 - NON_EXTRACTABLE_PDF (not a server error, but extraction failure)
      if (response.status === 422) {
        const errorMsg = data.message || 'This PDF cannot be read. Please use a different file or paste your resume text.';
        const error = new Error(errorMsg);
        (error as any).errorCode = data.errorCode || 'NON_EXTRACTABLE_PDF';
        (error as any).solutions = data.solutions || [];
        throw error;
      }

      if (!response.ok) {
        // Extract specific error message from API response
        const errorMsg = data.message || data.userMessage || data.error || 'Failed to upload and parse resume';
        throw new Error(errorMsg);
      }
      
      // Check if parsing actually succeeded
      if (data.success === false) {
        const errorMsg = data.message || data.userMessage || data.error || 'Resume parsing failed';
        throw new Error(errorMsg);
      }
      
      const resumeData: ResumeUpload = {
        file,
        text: data.text,
        extractedData: {
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
          projects: data.projects || [],
          achievements: data.achievements || [],
          contact: data.contact || {},
          summary: data.summary || '',
        },
        // Ensure confidence is always an object with 'overall' property
        confidence: typeof data.confidence === 'object' && data.confidence !== null
          ? {
              overall: data.confidence.overall || 0,
              skills: data.confidence.skills || 0,
              experience: data.confidence.experience || 0,
              projects: data.confidence.projects || 0
            }
          : {
              overall: typeof data.confidence === 'number' ? data.confidence : 0,
              skills: 0,
              experience: 0,
              projects: 0
            },
        structuredData: data.structuredData || undefined
      };

      setResumeUpload(resumeData);
      
return resumeData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while uploading resume';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeFuture = useCallback(async (timeMachineData: TimeMachineData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the STRICT analyze-fixed endpoint (v4.0)
      const response = await fetch('/api/time-machine/analyze-fixed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeMachineData),
      });

      const data: TimeMachineResponse = await response.json();

      // Handle 422 - Extraction/validation failure (not a server error)
      if (response.status === 422) {
        const errorMsg = data.message || 'Cannot generate predictions. Resume data is insufficient.';
        const error = new Error(errorMsg);
        (error as any).errorCode = data.errorCode || 'EXTRACTION_FAILED';
        (error as any).solutions = data.solutions || [];
        throw error;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze future prediction');
      }
      
      if (!data.success) {
        throw new Error(data.message || data.error || 'Failed to generate prediction');
      }

      setPrediction(data.prediction);
      
return data.prediction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);



  const downloadJSON = useCallback((data: any, filename: string = 'time-machine-data.json') => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred downloading JSON';
      setError(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    setPrediction(null);
    setResumeUpload(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    prediction,
    resumeUpload,
    uploadResume,
    analyzeFuture,
    downloadJSON,
    reset,
  };
};
