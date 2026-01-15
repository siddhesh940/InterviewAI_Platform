// Time Machine Feature Types

export interface TimeMachineData {
  resumeText: string;
  targetRole: string;
  timeGoal: 30 | 60 | 90;
  interviewScores: InterviewScores;
  strengths: string[];
  weaknesses: string[];
  technicalPatterns: TechnicalPattern[];
  communicationPatterns: CommunicationPattern[];
}

export interface InterviewScores {
  technical: number;
  communication: number;
  confidence: number;
  eyeContact: number;
  problemSolving: number;
  overall: number;
}

export interface TechnicalPattern {
  skill: string;
  currentLevel: number;
  attempts: number;
  successRate: number;
  lastUsed: string;
}

export interface CommunicationPattern {
  clarity: number;
  pace: number;
  confidence: number;
  expressiveness: number;
  responseTime: number;
}

export interface FuturePrediction {
  targetRole: string;
  timeframe: string;
  confidence: number;
  skills: FutureSkills;
  projects: FutureProject[];
  jobRole: FutureJobRole;
  salary: FutureSalary;
  achievements: FutureAchievement[];
  roadmap: GrowthRoadmap;
  comparison: BeforeAfterComparison;
  futureResume: FutureResume;
  generatedAt: string;
  version: string;
}

export interface FutureSkills {
  [skill: string]: {
    current: number;
    future: number;
    improvement: number;
    marketRelevance: number;
    priority: string;
    reasoning: string;
  };
}

export interface FutureProject {
  title: string;
  techStack: string[];
  role: string;
  description: string;
  impact: string;
  reasoning: string;
  timeline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface FutureJobRole {
  predictedRole: string;
  confidence: number;
  reasoning: string;
  requirements: string[];
  readinessScore: number;
}

export interface FutureSalary {
  estimate: string;
  range: {
    min: number;
    max: number;
  };
  currency: string;
  timeline: string;
  reasoning: string;
  factors: string[];
}

export interface FutureAchievement {
  title: string;
  description: string;
  timeline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Technical' | 'Portfolio' | 'Career';
}

export interface GrowthRoadmap {
  day30: RoadmapPhase;
  day60: RoadmapPhase;
  day90: RoadmapPhase;
}

export interface RoadmapPhase {
  goals: string[];
  dailyPlan: DailyPlan[];
  weeklyMissions: WeeklyMission[];
  monthlyMilestones: string[];
  focusAreas: string[];
}

export interface DailyPlan {
  day: number;
  activities: string[];
  timeCommitment: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface WeeklyMission {
  week: number;
  title: string;
  objectives: string[];
  deliverables: string[];
  skillsToImprove: string[];
}

export interface BeforeAfterComparison {
  current: {
    skills: { [skill: string]: number };
    confidence: number;
    technicalDepth: number;
    projects: number;
    readinessLevel: number;
  };
  future: {
    skills: { [skill: string]: number };
    confidence: number;
    technicalDepth: number;
    projects: number;
    readinessLevel: number;
  };
}

export interface FutureResume {
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
  atsScore: number;
  improvements: string[];
}

export interface TimeMachineResponse {
  success: boolean;
  prediction: FuturePrediction;
  error?: string;
}

export interface ResumeUpload {
  file: File;
  text: string;
  extractedData: {
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
    achievements: string[];
    contact?: {
      name?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      location?: string;
    };
    summary?: string;
  };
  confidence?: {
    overall: number;
    skills: number;
    experience: number;
    projects: number;
  };
  structuredData?: {
    experience: Array<{
      role: string;
      company: string;
      duration: string;
      bullets: string[];
    }>;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      link?: string;
    }>;
    education: Array<{
      degree: string;
      college: string;
      year: string;
      cgpa?: string;
    }>;
  };
}

export const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Mobile App Developer',
  'Cloud Architect',
  'Software Engineer',
  'Technical Lead',
  'QA Engineer',
  'Business Analyst',
  'Project Manager',
] as const;

export type TargetRole = typeof TARGET_ROLES[number];

// Enhanced Resume Parsing Types
export interface ParsedResume {
  rawText: string;
  sections: ResumeSection[];
  extractedData: EnhancedExtractionData;
  confidence: ParseConfidence;
  parseMethod: 'pdfminer' | 'pymupdf' | 'tesseract' | 'hybrid';
  warnings: string[];
}

export interface ResumeSection {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'achievements' | 'certifications';
  content: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface EnhancedExtractionData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategories;
  projects: Project[];
  achievements: Achievement[];
  certifications: string[];
}

export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  duration: string;
  responsibilities: string[];
  impactKeywords: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  cgpa?: string;
  location?: string;
}

export interface SkillCategories {
  technical: string[];
  softSkills: string[];
  tools: string[];
  languages: string[];
  frameworks: string[];
  databases: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  outcomes: string[];
  metrics: string[];
  link?: string;
  duration?: string;
}

export interface Achievement {
  title: string;
  description: string;
  category: 'academic' | 'professional' | 'personal' | 'certification';
  date?: string;
}

export interface ParseConfidence {
  overall: number;
  sections: {
    contact: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
    achievements: number;
  };
  textClarity: number;
  structureDetection: number;
  entityCount: number;
}

// Enhanced Analysis Types
export interface AnalysisRequest {
  parsedResume: ParsedResume;
  targetRole: TargetRole;
  timeframe: 30 | 60 | 90;
  interviewScores?: InterviewScores;
}

export interface AnalysisValidation {
  isValid: boolean;
  minConfidenceReached: boolean;
  missingCriticalData: string[];
  warnings: string[];
  canProceed: boolean;
}
