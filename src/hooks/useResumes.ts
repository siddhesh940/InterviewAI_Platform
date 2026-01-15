import { downloadResumeAsPDF } from '@/lib/pdf-utils';
import { CreateResumeRequest, ResumeData, SavedResume, UpdateResumeRequest } from '@/types/resume';
import { useEffect, useState } from 'react';

export const useResumes = () => {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resumes');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resumes');
      }
      
      setResumes(data.resumes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (resumeData: CreateResumeRequest): Promise<SavedResume | null> => {
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create resume');
      }
      
      await fetchResumes(); // Refresh the list
      
return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      
return null;
    }
  };

  const updateResume = async (updateData: UpdateResumeRequest): Promise<SavedResume | null> => {
    try {
      const response = await fetch('/api/resumes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update resume');
      }
      
      await fetchResumes(); // Refresh the list
      
return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      
return null;
    }
  };

  const deleteResume = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete resume');
      }
      
      // Optimistic update
      setResumes(prev => prev.filter(resume => resume.id !== id));
      
return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      
return false;
    }
  };

  const getResume = async (id: string): Promise<SavedResume | null> => {
    try {
      const response = await fetch(`/api/resumes/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resume');
      }
      
      return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      
return null;
    }
  };

  const downloadPDF = async (resumeData: ResumeData, template: string = "Executive Minimal") => {
    try {
      await downloadResumeAsPDF(resumeData, template);
    } catch (err) {
      setError('Failed to download PDF');
      throw err;
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return {
    resumes,
    loading,
    error,
    fetchResumes,
    createResume,
    updateResume,
    deleteResume,
    getResume,
    downloadPDF,
    setError,
  };
};
