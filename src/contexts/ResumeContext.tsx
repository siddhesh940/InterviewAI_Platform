"use client";

import React, { createContext, useContext, useState } from 'react';

// Define ResumeData interface
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  jobTitle: string;
  summary: string;
}

interface WorkExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  college: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string;
  github?: string;
  liveLink?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  projects: Project[];
  certifications: string[];
  achievements: string[];
}

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  templateId: string;
  setTemplateId: (template: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
    location: "",
    summary: ""
  },
  workExperience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    tools: []
  },
  projects: [],
  certifications: [],
  achievements: []
};

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [templateId, setTemplateId] = useState("modern-blue");

  const value: ResumeContextType = {
    resumeData,
    setResumeData,
    currentStep,
    setCurrentStep,
    templateId,
    setTemplateId
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  
return context;
}
