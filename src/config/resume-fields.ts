/**
 * Resume Fields Configuration
 * Defines the form structure for each section of the resume builder
 * Based on resumeIQ architecture
 */

import { ResumeSections } from '@/types/resume-builder';

const ResumeFields: ResumeSections = {
  contact: {
    name: 'Contact Information',
    fields: [
      { name: 'name', label: 'Full Name', placeholder: 'Siddhesh Patil', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '7715954900' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'patilsiddhesh2810@gmail.com', required: true },
      { name: 'linkedin', label: 'LinkedIn Profile', placeholder: 'linkedin.com/in/your-profile' },
      { name: 'github', label: 'GitHub Profile', placeholder: 'github.com/yourusername' },
      { name: 'portfolio', label: 'Portfolio Website', placeholder: 'https://yourportfolio.com' },
      { name: 'location', label: 'Location', placeholder: 'Pune, India' },
    ],
  },

  summary: {
    name: 'Professional Summary',
    fields: [
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        placeholder: 'Write a 2-3 line summary highlighting your experience, skills, and career objectives...',
        span: true,
        rows: 4,
      },
    ],
  },

  skills: {
    name: 'Skills',
    fields: [
      {
        name: 'skills',
        label: 'Skills',
        type: 'textarea',
        placeholder: `Languages: JavaScript, Python, Java
Frameworks: React, Node.js, Express
Databases: MongoDB, PostgreSQL
Tools: Git, Docker, AWS`,
        span: true,
        rows: 6,
      },
    ],
  },

  experience: {
    name: 'Professional Experience',
    multiple: true,
    fields: [
      { name: 'role', label: 'Job Title', placeholder: 'Software Engineer', required: true },
      { name: 'company', label: 'Company Name', placeholder: 'Tech Solutions Inc.', required: true },
      { name: 'location', label: 'Location', placeholder: 'Pune, India' },
      { name: 'start', label: 'Start Date', type: 'month' },
      { name: 'end', label: 'End Date', type: 'month' },
      {
        name: 'description',
        label: 'Key Responsibilities & Achievements',
        type: 'textarea',
        placeholder: `• Developed scalable features using React and Node.js
• Improved system performance by 25%
• Collaborated with cross-functional teams`,
        span: true,
        rows: 5,
        multipoints: true,
      },
    ],
  },

  projects: {
    name: 'Projects',
    multiple: true,
    fields: [
      { name: 'title', label: 'Project Title', placeholder: 'Weather Application', required: true },
      { name: 'url', label: 'Project URL', type: 'url', placeholder: 'https://example.com/project' },
      {
        name: 'description',
        label: 'Project Description & Impact',
        type: 'textarea',
        placeholder: `• Built a responsive weather app using React.js
• Implemented real-time data fetching
• Added location search and 5-day forecast`,
        span: true,
        rows: 4,
        multipoints: true,
      },
    ],
  },

  education: {
    name: 'Education',
    multiple: true,
    fields: [
      { name: 'degree', label: 'Degree / Certification', placeholder: 'B.E. in Computer Engineering', required: true },
      { name: 'institution', label: 'Institution', placeholder: 'XYZ Engineering College', required: true },
      { name: 'location', label: 'Location', placeholder: 'Pune, India' },
      { name: 'start', label: 'Start Date', type: 'month' },
      { name: 'end', label: 'End Date', type: 'month' },
      { name: 'gpa', label: 'GPA / CGPA', placeholder: '8.5/10' },
    ],
  },

  certifications: {
    name: 'Certifications',
    multiple: true,
    fields: [
      { name: 'title', label: 'Certification Name', placeholder: 'AWS Solutions Architect', required: true },
      { name: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
      { name: 'date', label: 'Date Obtained', type: 'month' },
    ],
  },
};

export default ResumeFields;

// Tab order for navigation
export const TAB_ORDER = ['contact', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'] as const;
export type TabKey = typeof TAB_ORDER[number];
