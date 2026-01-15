import { useCallback, useState } from 'react';

export interface ResumeData {
  personalInfo: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
    summary: string;
  };
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    techStack: string[];
    description: string;
    githubLink: string;
  }>;
  education: Array<{
    degree: string;
    college: string;
    year: string;
    cgpa: string;
  }>;
  certifications: string[];
  achievements: string[];
}

export const useResumeBuilder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveWithAI = useCallback(async (type: string, text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resume-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, text }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve text with AI');
      }

      const data = await response.json();
      
return data.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generatePDF = useCallback(async (resumeData: ResumeData, template: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resume-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData, template }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const data = await response.json();
      
return data.pdf;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveResume = useCallback(async (_resumeData: ResumeData, resumeId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would save to your backend
      const mockSave = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: resumeId || Date.now().toString(),
            savedAt: new Date().toISOString(),
            message: 'Resume saved successfully'
          });
        }, 1000);
      });

      const result = await mockSave;
      
return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadResume = useCallback(async (_resumeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch from your backend
      const mockLoad = new Promise<ResumeData>((resolve) => {
        setTimeout(() => {
          resolve({
            personalInfo: {
              name: "John Doe",
              jobTitle: "Software Engineer",
              email: "john.doe@email.com",
              phone: "+1 (555) 123-4567",
              linkedin: "linkedin.com/in/johndoe",
              github: "github.com/johndoe",
              location: "San Francisco, CA",
              summary: "Experienced software engineer with a passion for building scalable applications."
            },
            skills: {
              technical: ["React", "Node.js", "TypeScript", "Python"],
              soft: ["Leadership", "Communication", "Problem Solving"],
              tools: ["Git", "Docker", "AWS", "Jira"]
            },
            experience: [{
              role: "Senior Software Engineer",
              company: "Tech Company Inc.",
              duration: "Jan 2022 - Present",
              description: "Led development of scalable web applications serving 1M+ users."
            }],
            projects: [{
              title: "E-commerce Platform",
              techStack: ["React", "Node.js", "MongoDB"],
              description: "Built a full-stack e-commerce platform with real-time features.",
              githubLink: "https://github.com/johndoe/ecommerce"
            }],
            education: [{
              degree: "B.Tech in Computer Science",
              college: "XYZ Institute of Technology",
              year: "2021",
              cgpa: "8.4/10"
            }],
            certifications: ["AWS Certified Developer", "Google Cloud Professional"],
            achievements: ["Employee of the Year 2023", "Hackathon Winner"]
          });
        }, 1000);
      });

      const data = await mockLoad;
      
return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    improveWithAI,
    generatePDF,
    saveResume,
    loadResume,
  };
};
