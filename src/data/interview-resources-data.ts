// src/data/interview-resources-data.ts
// Enterprise-grade PDF Resource Management System

export type PDFCategory = 
  | 'programming-languages'
  | 'backend-frameworks'
  | 'databases-sql'
  | 'dsa-coding'
  | 'web-development'
  | 'comprehensive-general';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PDFResource {
  id: string;
  title: string;
  category: PDFCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  filePath: string;
  fileName: string;
  description?: string;
  pages?: number;
}

export interface CategoryInfo {
  id: PDFCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Category definitions
export const categories: CategoryInfo[] = [
  {
    id: 'programming-languages',
    name: 'Programming Languages',
    description: 'Java, JavaScript, Python, C and more',
    icon: 'Code2',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    id: 'backend-frameworks',
    name: 'Backend & Frameworks',
    description: 'Node.js, Express.js, MongoDB',
    icon: 'Server',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    id: 'databases-sql',
    name: 'Databases & SQL',
    description: 'DBMS, SQL Queries, Cheat Sheets',
    icon: 'Database',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  {
    id: 'dsa-coding',
    name: 'DSA & Coding Interviews',
    description: 'Cracking the Coding Interview, Practice',
    icon: 'BrainCircuit',
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend, Full Stack, HTML/CSS',
    icon: 'Globe',
    color: '#ec4899',
    bgColor: '#fdf2f8',
  },
  {
    id: 'comprehensive-general',
    name: 'Comprehensive & General',
    description: 'Mixed Interview Materials',
    icon: 'BookOpen',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
];

// All PDF resources with proper categorization
export const pdfResources: PDFResource[] = [
  // 1️⃣ Programming Languages
  {
    id: 'java-interview',
    title: 'Java Interview Questions',
    category: 'programming-languages',
    difficulty: 'Intermediate',
    tags: ['Java', 'OOP', 'Core Java'],
    filePath: '/InterviewPrep/1.Java-Interview-Questions.pdf',
    fileName: '1.Java-Interview-Questions.pdf',
    description: 'Comprehensive Java interview questions covering OOP, collections, and more.',
  },
  {
    id: 'js-100-questions',
    title: '100 Most Asked JavaScript Interview Questions',
    category: 'programming-languages',
    difficulty: 'Intermediate',
    tags: ['JavaScript', 'ES6', 'Frontend'],
    filePath: '/InterviewPrep/100 Most AskedJavaScript Interview.pdf',
    fileName: '100 Most AskedJavaScript Interview.pdf',
    description: 'Top 100 JavaScript questions asked in tech interviews.',
  },
  {
    id: 'python-100-questions',
    title: '100 Python Interview Questions',
    category: 'programming-languages',
    difficulty: 'Intermediate',
    tags: ['Python', 'Data Science', 'Backend'],
    filePath: '/InterviewPrep/100 python interview questions .pdf',
    fileName: '100 python interview questions .pdf',
    description: '100 essential Python questions for all levels.',
  },
  {
    id: 'js-interview',
    title: 'JavaScript Interview Questions',
    category: 'programming-languages',
    difficulty: 'Intermediate',
    tags: ['JavaScript', 'Web', 'Frontend'],
    filePath: '/InterviewPrep/JS Interview Questions.pdf',
    fileName: 'JS Interview Questions.pdf',
    description: 'Core JavaScript concepts for interviews.',
  },
  {
    id: 'c-program-notes',
    title: 'C Programming Interview Notes',
    category: 'programming-languages',
    difficulty: 'Beginner',
    tags: ['C', 'Programming', 'Basics'],
    filePath: '/InterviewPrep/GOOD Interview c program and notes.pdf',
    fileName: 'GOOD Interview c program and notes.pdf',
    description: 'C programming fundamentals and interview preparation.',
  },
  {
    id: 'css-interview',
    title: 'CSS Interview Questions',
    category: 'programming-languages',
    difficulty: 'Beginner',
    tags: ['CSS', 'Styling', 'Frontend'],
    filePath: '/InterviewPrep/CSS interview question.pdf',
    fileName: 'CSS interview question.pdf',
    description: 'CSS concepts, layouts, and styling questions.',
  },
  {
    id: 'html-interview',
    title: 'HTML Interview Questions & Answers',
    category: 'programming-languages',
    difficulty: 'Beginner',
    tags: ['HTML', 'Web', 'Frontend'],
    filePath: '/InterviewPrep/HTML Interview Question And Answer.pdf',
    fileName: 'HTML Interview Question And Answer.pdf',
    description: 'HTML fundamentals and semantic markup questions.',
  },

  // 2️⃣ Backend & Frameworks
  {
    id: 'nodejs-interview',
    title: 'Node.js Interview Q&A',
    category: 'backend-frameworks',
    difficulty: 'Intermediate',
    tags: ['Node.js', 'Backend', 'API'],
    filePath: '/InterviewPrep/Node js interview q and a.pdf',
    fileName: 'Node js interview q and a.pdf',
    description: 'Node.js runtime, event loop, and backend concepts.',
  },
  {
    id: 'expressjs-interview',
    title: 'Express.js Interview Q&A',
    category: 'backend-frameworks',
    difficulty: 'Intermediate',
    tags: ['Express', 'REST API', 'Middleware'],
    filePath: '/InterviewPrep/Express js interview q and a.pdf',
    fileName: 'Express js interview q and a.pdf',
    description: 'Express.js framework, routing, and middleware questions.',
  },
  {
    id: 'mongodb-interview-1',
    title: 'MongoDB Interview Questions',
    category: 'backend-frameworks',
    difficulty: 'Intermediate',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    filePath: '/InterviewPrep/MongoDB Interview Questions.pdf',
    fileName: 'MongoDB Interview Questions.pdf',
    description: 'MongoDB queries, aggregation, and schema design.',
  },
  {
    id: 'mongodb-interview-advanced',
    title: 'MongoDB Interview - Basic to Advanced',
    category: 'backend-frameworks',
    difficulty: 'Advanced',
    tags: ['MongoDB', 'NoSQL', 'Advanced'],
    filePath: '/InterviewPrep/MongoDB Interview Questions and Answers From Basic To Advanced Level.pdf',
    fileName: 'MongoDB Interview Questions and Answers From Basic To Advanced Level.pdf',
    description: 'Comprehensive MongoDB guide from basics to advanced topics.',
  },

  // 3️⃣ Databases & SQL
  {
    id: 'dbms-interview-1',
    title: 'DBMS Interview Questions',
    category: 'databases-sql',
    difficulty: 'Intermediate',
    tags: ['DBMS', 'Database', 'Theory'],
    filePath: '/InterviewPrep/Dbms interview questions .pdf',
    fileName: 'Dbms interview questions .pdf',
    description: 'Database management system concepts and theory.',
  },
  {
    id: 'dbms-interview-2',
    title: 'DBMS Interview Questions (Set 2)',
    category: 'databases-sql',
    difficulty: 'Intermediate',
    tags: ['DBMS', 'Normalization', 'ER Model'],
    filePath: '/InterviewPrep/Dbms interview questions s.pdf',
    fileName: 'Dbms interview questions s.pdf',
    description: 'Additional DBMS questions on normalization and ER diagrams.',
  },
  {
    id: 'dbms-interview-3',
    title: 'DBMS Interview Questions (Set 3)',
    category: 'databases-sql',
    difficulty: 'Advanced',
    tags: ['DBMS', 'Transactions', 'Indexing'],
    filePath: '/InterviewPrep/Dbms interview questions ss.pdf',
    fileName: 'Dbms interview questions ss.pdf',
    description: 'Advanced DBMS topics including transactions and indexing.',
  },
  {
    id: 'sql-interview',
    title: 'SQL Interview Questions & Answers',
    category: 'databases-sql',
    difficulty: 'Intermediate',
    tags: ['SQL', 'Queries', 'Joins'],
    filePath: '/InterviewPrep/SQL interview questions and answers.pdf',
    fileName: 'SQL interview questions and answers.pdf',
    description: 'Common SQL interview questions with detailed answers.',
  },
  {
    id: 'sql-query-interview',
    title: 'SQL Query Interview Questions',
    category: 'databases-sql',
    difficulty: 'Advanced',
    tags: ['SQL', 'Complex Queries', 'Practice'],
    filePath: '/InterviewPrep/SQL query interview questions.pdf',
    fileName: 'SQL query interview questions.pdf',
    description: 'Hands-on SQL query problems for interviews.',
  },
  {
    id: 'sql-cheatsheet-1',
    title: 'SQL Cheat Sheet',
    category: 'databases-sql',
    difficulty: 'Beginner',
    tags: ['SQL', 'Reference', 'Quick Guide'],
    filePath: '/InterviewPrep/SQL Cheat Sheet.pdf',
    fileName: 'SQL Cheat Sheet.pdf',
    description: 'Quick reference guide for SQL syntax and commands.',
  },
  {
    id: 'sql-cheatsheet-2',
    title: 'SQL Cheat Sheet (Extended)',
    category: 'databases-sql',
    difficulty: 'Beginner',
    tags: ['SQL', 'Reference', 'Commands'],
    filePath: '/InterviewPrep/SQL Cheat Sheet-1.pdf',
    fileName: 'SQL Cheat Sheet-1.pdf',
    description: 'Extended SQL cheat sheet with more commands.',
  },
  {
    id: 'sql-data-analysis',
    title: 'SQL for Data Analysis',
    category: 'databases-sql',
    difficulty: 'Advanced',
    tags: ['SQL', 'Analytics', 'Data Science'],
    filePath: '/InterviewPrep/SQL for Data Analysis .pdf',
    fileName: 'SQL for Data Analysis .pdf',
    description: 'SQL techniques for data analysis and reporting.',
  },

  // 4️⃣ DSA & Coding Interviews
  {
    id: 'dsa-master-cpp',
    title: 'Step-by-Step Guide to Master DSA using C++',
    category: 'dsa-coding',
    difficulty: 'Advanced',
    tags: ['DSA', 'C++', 'Data Structures', 'Algorithms'],
    filePath: '/InterviewPrep/0.0 Step-by-Step Guide to Master DSA using C++.pdf',
    fileName: '0.0 Step-by-Step Guide to Master DSA using C++.pdf',
    description: 'Complete roadmap to master Data Structures and Algorithms with C++.',
  },
  {
    id: 'top-100-dsa',
    title: 'Top 100 DSA Interview Questions',
    category: 'dsa-coding',
    difficulty: 'Intermediate',
    tags: ['DSA', 'Top Questions', 'Practice', 'Coding'],
    filePath: '/InterviewPrep/0.1 top 100 dsa interview questions.pdf',
    fileName: '0.1 top 100 dsa interview questions.pdf',
    description: 'Top 100 most asked DSA questions in technical interviews.',
  },
  {
    id: 'cracking-coding-1',
    title: 'Cracking the Coding Interview',
    category: 'dsa-coding',
    difficulty: 'Advanced',
    tags: ['DSA', 'FAANG', 'Problem Solving'],
    filePath: '/InterviewPrep/14.Cracking the Coding Interview.pdf',
    fileName: '14.Cracking the Coding Interview.pdf',
    description: 'The classic guide to acing coding interviews.',
  },
  {
    id: 'cracking-coding-2',
    title: 'Cracking the Coding Interview (Edition 2)',
    category: 'dsa-coding',
    difficulty: 'Advanced',
    tags: ['DSA', 'Algorithms', 'Big Tech'],
    filePath: '/InterviewPrep/Cracking the Coding Interview.pdf',
    fileName: 'Cracking the Coding Interview.pdf',
    description: 'Another edition with additional practice problems.',
  },
  {
    id: 'cracking-interview',
    title: 'Cracking Interview',
    category: 'dsa-coding',
    difficulty: 'Intermediate',
    tags: ['Interview', 'Tips', 'Strategy'],
    filePath: '/InterviewPrep/Cracking Interview.pdf',
    fileName: 'Cracking Interview.pdf',
    description: 'General interview cracking strategies and tips.',
  },

  // 5️⃣ Web Development - Frontend, Full Stack, MERN
  {
    id: 'html-css-frontend',
    title: 'HTML CSS Front End Interview Questions',
    category: 'web-development',
    difficulty: 'Beginner',
    tags: ['HTML', 'CSS', 'Frontend', 'Web'],
    filePath: '/InterviewPrep/1.0 HTML CSS Front End Interview Questions.pdf',
    fileName: '1.0 HTML CSS Front End Interview Questions.pdf',
    description: 'Essential HTML and CSS questions for frontend interviews.',
  },
  {
    id: 'html-css-frontend-answers',
    title: 'HTML CSS Front End - Answers',
    category: 'web-development',
    difficulty: 'Beginner',
    tags: ['HTML', 'CSS', 'Frontend', 'Solutions'],
    filePath: '/InterviewPrep/1.1  Answer- HTML CSS Front End Interview Questions.pdf',
    fileName: '1.1  Answer- HTML CSS Front End Interview Questions.pdf',
    description: 'Detailed answers to HTML/CSS frontend interview questions.',
  },
  {
    id: 'js-interview-questions',
    title: 'JavaScript Interview Questions',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['JavaScript', 'ES6', 'Frontend', 'Web'],
    filePath: '/InterviewPrep/2.0 JS Interview Questions.pdf',
    fileName: '2.0 JS Interview Questions.pdf',
    description: 'Core JavaScript concepts and interview questions.',
  },
  {
    id: 'js-interview-answers',
    title: 'JavaScript Interview - Answers',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['JavaScript', 'ES6', 'Solutions'],
    filePath: '/InterviewPrep/2.1 answers- js interview questions.pdf',
    fileName: '2.1 answers- js interview questions.pdf',
    description: 'Complete answers to JavaScript interview questions.',
  },
  {
    id: 'react-interview-questions',
    title: 'React Interview Questions',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['React', 'Frontend', 'Hooks', 'Components'],
    filePath: '/InterviewPrep/3.0 react interview questions by subham.pdf',
    fileName: '3.0 react interview questions by subham.pdf',
    description: 'React.js concepts including hooks, state, and components.',
  },
  {
    id: 'react-interview-answers',
    title: 'React Interview - Answers',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['React', 'Solutions', 'Best Practices'],
    filePath: '/InterviewPrep/3.1 answers-react interview questions by subham.pdf',
    fileName: '3.1 answers-react interview questions by subham.pdf',
    description: 'Detailed answers to React interview questions.',
  },
  {
    id: 'mern-200-questions',
    title: 'Top 200 MERN Interview Questions',
    category: 'web-development',
    difficulty: 'Advanced',
    tags: ['MERN', 'Full Stack', 'MongoDB', 'Express', 'React', 'Node'],
    filePath: '/InterviewPrep/4.0 top 200 mern interview questions.pdf',
    fileName: '4.0 top 200 mern interview questions.pdf',
    description: '200 comprehensive MERN stack interview questions.',
  },
  {
    id: 'mern-200-answers',
    title: 'Top 200 MERN - Answers',
    category: 'web-development',
    difficulty: 'Advanced',
    tags: ['MERN', 'Full Stack', 'Solutions'],
    filePath: '/InterviewPrep/4.1 answers- top 200 mern interview questions.pdf',
    fileName: '4.1 answers- top 200 mern interview questions.pdf',
    description: 'Complete answers to 200 MERN stack questions.',
  },
  {
    id: 'backend-database-questions',
    title: 'Backend & Database Interview Questions',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['Backend', 'Database', 'API', 'Server'],
    filePath: '/InterviewPrep/5.0 Backend & Database Interview Questions.pdf',
    fileName: '5.0 Backend & Database Interview Questions.pdf',
    description: 'Backend development and database concepts for interviews.',
  },
  {
    id: 'backend-database-answers',
    title: 'Backend & Database - Answers',
    category: 'web-development',
    difficulty: 'Intermediate',
    tags: ['Backend', 'Database', 'Solutions'],
    filePath: '/InterviewPrep/5.1 Answers- Backend & Database Interview Questions.pdf',
    fileName: '5.1 Answers- Backend & Database Interview Questions.pdf',
    description: 'Detailed answers to backend and database questions.',
  },

  // 6️⃣ Comprehensive & General Interview Prep
  {
    id: 'comprehensive-material',
    title: 'Comprehensive Interview Material',
    category: 'comprehensive-general',
    difficulty: 'Intermediate',
    tags: ['All Topics', 'Complete Guide', '61 Pages'],
    filePath: '/InterviewPrep/Comprehensive interview material (online study4u)(61pgs).pdf',
    fileName: 'Comprehensive interview material (online study4u)(61pgs).pdf',
    pages: 61,
    description: 'All-in-one interview preparation material covering multiple topics.',
  },
  {
    id: 'interview-questions-161',
    title: 'Interview Questions Collection',
    category: 'comprehensive-general',
    difficulty: 'Intermediate',
    tags: ['Mixed Topics', 'Practice', '161 Pages'],
    filePath: '/InterviewPrep/Interview questions (161pgs).pdf',
    fileName: 'Interview questions (161pgs).pdf',
    pages: 161,
    description: 'Large collection of interview questions across various topics.',
  },
];

// Helper functions
export const getCategoryById = (id: PDFCategory): CategoryInfo | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getResourcesByCategory = (categoryId: PDFCategory): PDFResource[] => {
  return pdfResources.filter(pdf => pdf.category === categoryId);
};

export const searchResources = (query: string): PDFResource[] => {
  const lowerQuery = query.toLowerCase();
  
return pdfResources.filter(pdf => 
    pdf.title.toLowerCase().includes(lowerQuery) ||
    pdf.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    pdf.description?.toLowerCase().includes(lowerQuery)
  );
};

export const getResourcesByDifficulty = (difficulty: DifficultyLevel): PDFResource[] => {
  return pdfResources.filter(pdf => pdf.difficulty === difficulty);
};

export const getResourceById = (id: string): PDFResource | undefined => {
  return pdfResources.find(pdf => pdf.id === id);
};

// Stats
export const getStats = () => ({
  totalPDFs: pdfResources.length,
  totalCategories: categories.length,
  byDifficulty: {
    Beginner: pdfResources.filter(p => p.difficulty === 'Beginner').length,
    Intermediate: pdfResources.filter(p => p.difficulty === 'Intermediate').length,
    Advanced: pdfResources.filter(p => p.difficulty === 'Advanced').length,
  },
  byCategory: categories.map(cat => ({
    ...cat,
    count: pdfResources.filter(p => p.category === cat.id).length,
  })),
});

// Difficulty badge colors
export const difficultyConfig: Record<DifficultyLevel, { color: string; bgColor: string }> = {
  Beginner: { color: '#22c55e', bgColor: '#dcfce7' },
  Intermediate: { color: '#f59e0b', bgColor: '#fef3c7' },
  Advanced: { color: '#ef4444', bgColor: '#fee2e2' },
};
