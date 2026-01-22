/**
 * Resume Builder Type Definitions
 * Matches the uploaded PDF structure: Header, Summary, Skills, Experience, Projects, Education, Certifications
 */

// Contact/Header Section
export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio?: string;
  location?: string;
}

// Summary Section
export interface SummaryInfo {
  summary: string;
}

// Skills Section - grouped format
export interface SkillsInfo {
  skills: string; // Multi-line text with categories, e.g., "Languages: JavaScript, Python\nFrameworks: React, Node.js"
}

// Experience Section
export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  start: string; // YYYY-MM format
  end: string; // YYYY-MM format or empty for "Present"
  description: string; // Multi-line bullet points
}

// Project Section
export interface ProjectItem {
  title: string;
  url?: string;
  description: string; // Multi-line bullet points
}

// Education Section
export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  gpa?: string;
}

// Certification Section
export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
}

// Complete Resume Data Structure
export interface ResumeBuilderData {
  contact: ContactInfo;
  summary: SummaryInfo;
  skills: SkillsInfo;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  saved: boolean;
}

// Field configuration for dynamic form rendering
export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'month' | 'textarea' | 'url';
  placeholder?: string;
  required?: boolean;
  span?: boolean; // Full width
  rows?: number; // For textarea
  multipoints?: boolean; // Indicates bullet-point input
}

export interface SectionConfig {
  name: string;
  multiple?: boolean; // Array of items (experience, projects, etc.)
  fields: FieldConfig[];
}

// Resume Sections Configuration
export type ResumeSections = {
  [key: string]: SectionConfig;
};

// Default empty resume state
export const createDefaultResume = (): ResumeBuilderData => ({
  contact: {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: '',
  },
  summary: {
    summary: '',
  },
  skills: {
    skills: '',
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  saved: false,
});

// Sample resume for testing/preview
export const sampleResume: ResumeBuilderData = {
  contact: {
    name: 'Siddhesh Patil',
    phone: '7715954900',
    email: 'patilsiddhesh2810@gmail.com',
    linkedin: 'linkedin.com/in/siddhesh-patil-268b96311',
    github: 'github.com/siddhesh940',
    location: '',
  },
  summary: {
    summary: 'Passionate Computer Engineering student with strong foundation in full-stack web development. Experienced in building responsive web applications using React, Next.js, and modern JavaScript. Eager to apply technical skills and problem-solving abilities in real-world software development projects.',
  },
  skills: {
    skills: `Languages: C, C++, JavaScript, Python, SQL
Web Technologies: React.js, Next.js, Node.js, Express.js, HTML, CSS, Tailwind CSS
Databases: MongoDB, PostgreSQL, Firebase
Tools & Platforms: Git, GitHub, VS Code, Postman, Vercel, Netlify
Concepts: REST APIs, CRUD Operations, Authentication, Responsive Design`,
  },
  experience: [
    {
      role: 'Software Developer Intern',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      start: '2024-06',
      end: '2024-08',
      description: `• Developed and maintained web applications using React.js and Node.js
• Collaborated with team members to implement new features and fix bugs
• Participated in code reviews and improved code quality by 20%`,
    },
  ],
  projects: [
    {
      title: 'Weather Application',
      url: 'https://star-weather-performance-52tu.vercel.app/',
      description: `• Built a responsive weather app using React.js and OpenWeather API
• Implemented real-time weather data fetching and display
• Added features like location search and 5-day forecast`,
    },
    {
      title: 'GitHub Profile Viewer',
      url: 'https://git-vio-npib.vercel.app/',
      description: `• Created a GitHub profile viewer using Next.js and GitHub API
• Displays user repositories, contributions, and profile information
• Implemented search functionality and responsive design`,
    },
  ],
  education: [
    {
      degree: 'B.E. in Computer Engineering',
      institution: 'XYZ Engineering College',
      location: 'Pune, India',
      start: '2022-08',
      end: '2026-05',
      gpa: '8.5/10',
    },
  ],
  certifications: [
    {
      title: 'Web Development Bootcamp',
      issuer: 'Udemy',
      date: '2024-03',
    },
    {
      title: 'React - The Complete Guide',
      issuer: 'Udemy',
      date: '2024-05',
    },
  ],
  saved: true,
};
