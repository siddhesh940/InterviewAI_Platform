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

export interface SavedResume {
  data: any;
  id: string;
  user_id?: string;
  userId?: string;
  title: string;
  target_role?: string;
  targetRole?: string;
  template: string;
  resume_data?: ResumeData;
  resumeData?: ResumeData;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface CreateResumeRequest {
  title: string;
  targetRole: string;
  template: string;
  resumeData: ResumeData;
}

export interface UpdateResumeRequest {
  id: string;
  title?: string;
  targetRole?: string;
  template?: string;
  resumeData?: ResumeData;
}
