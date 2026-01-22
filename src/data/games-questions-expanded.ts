// src/data/games-questions-expanded.ts
// Expanded Question Pools for Production-Grade Training Games
// Minimum 5-6 questions per difficulty per game = 15-18 questions per game

import { DifficultyLevel, QuestionPool, SkillCategory } from '@/contexts/GamesContext';

// ============================================
// CONSTANTS
// ============================================

export const difficultyColors: Record<DifficultyLevel, { text: string; bg: string; border: string }> = {
  beginner: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  intermediate: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  advanced: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

export const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AnswerBuilderQuestion {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  interviewQuestion: string;
  blocks: string[];
  correctOrder: number[];
  idealAnswer: string;
  explanation: string;
  skillFocus: SkillCategory;
}

export interface KeywordMappingQuestion {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  topic: string;
  keywords: string[];
  sentences: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  skillFocus: SkillCategory;
}

export interface TruthOrBluffStatement {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  category: string;
  statement: string;
  answer: 'correct' | 'incorrect' | 'misleading';
  explanation: string;
  skillFocus: SkillCategory;
}

// ============================================
// ANSWER BUILDER QUESTIONS (18 total - 6 per difficulty)
// ============================================

export const answerBuilderQuestionsExpanded: AnswerBuilderQuestion[] = [
  // ========== BEGINNER (6 questions) ==========
  {
    id: 'ab-b1',
    pool: 'hr',
    difficulty: 'beginner',
    interviewQuestion: 'Tell me about yourself.',
    blocks: [
      'I am a software engineering graduate',
      'with hands-on project experience in web development.',
      'I am passionate about building user-friendly applications',
      'and eager to contribute to your team\'s success.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'I am a software engineering graduate with hands-on project experience in web development. I am passionate about building user-friendly applications and eager to contribute to your team\'s success.',
    explanation: 'Start with your background, add credentials, show passion, and end with value proposition.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-b2',
    pool: 'hr',
    difficulty: 'beginner',
    interviewQuestion: 'Why do you want to work here?',
    blocks: [
      'Your company\'s innovative approach aligns with my career goals.',
      'I\'ve researched your recent projects',
      'and I believe my skills can add value to your team.',
      'I\'m excited about the growth opportunities here.',
    ],
    correctOrder: [1, 0, 3, 2],
    idealAnswer: 'I\'ve researched your recent projects and your company\'s innovative approach aligns with my career goals. I\'m excited about the growth opportunities here and I believe my skills can add value to your team.',
    explanation: 'Show research first, then alignment, enthusiasm, and finally your value.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-b3',
    pool: 'hr',
    difficulty: 'beginner',
    interviewQuestion: 'What are your strengths?',
    blocks: [
      'One of my key strengths is problem-solving.',
      'For example, I optimized a database query',
      'reducing load time by 40%.',
      'This demonstrates my analytical thinking.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'One of my key strengths is problem-solving. For example, I optimized a database query reducing load time by 40%. This demonstrates my analytical thinking.',
    explanation: 'State the strength, provide evidence, show results, and reinforce.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-b4',
    pool: 'hr',
    difficulty: 'beginner',
    interviewQuestion: 'Where do you see yourself in 5 years?',
    blocks: [
      'In five years, I see myself as a senior developer',
      'with expertise in full-stack technologies.',
      'I want to mentor junior developers',
      'and contribute to impactful projects at your company.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'In five years, I see myself as a senior developer with expertise in full-stack technologies. I want to mentor junior developers and contribute to impactful projects at your company.',
    explanation: 'Show ambition, specific skills you want to develop, and commitment to the company.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-b5',
    pool: 'hr',
    difficulty: 'beginner',
    interviewQuestion: 'What is your greatest weakness?',
    blocks: [
      'I sometimes spend too much time perfecting code.',
      'I\'ve recognized this tendency',
      'and now set time limits for each task.',
      'This has improved my productivity significantly.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'I sometimes spend too much time perfecting code. I\'ve recognized this tendency and now set time limits for each task. This has improved my productivity significantly.',
    explanation: 'Acknowledge weakness, show self-awareness, explain improvement steps, and demonstrate growth.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-b6',
    pool: 'behavioral',
    difficulty: 'beginner',
    interviewQuestion: 'Why should we hire you?',
    blocks: [
      'I bring a combination of technical skills and enthusiasm.',
      'My projects demonstrate my ability to deliver results.',
      'I\'m a quick learner who adapts to new technologies.',
      'I\'m confident I can contribute from day one.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'I bring a combination of technical skills and enthusiasm. My projects demonstrate my ability to deliver results. I\'m a quick learner who adapts to new technologies. I\'m confident I can contribute from day one.',
    explanation: 'Highlight unique value, provide evidence, show adaptability, and express confidence.',
    skillFocus: 'communication',
  },

  // ========== INTERMEDIATE (6 questions) ==========
  {
    id: 'ab-i1',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'Describe a challenging project you worked on.',
    blocks: [
      'The project had a tight two-week deadline.',
      'I led a team of four developers',
      'and implemented daily standups and sprint planning.',
      'As a result, we delivered on time with zero critical bugs.',
      'I learned the importance of agile methodologies.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'The project had a tight two-week deadline. I led a team of four developers and implemented daily standups and sprint planning. As a result, we delivered on time with zero critical bugs. I learned the importance of agile methodologies.',
    explanation: 'STAR method: Situation → Task/Action → Action details → Result → Learning.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-i2',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'Tell me about a time you resolved a conflict.',
    blocks: [
      'Two team members disagreed on the tech stack choice.',
      'I organized a meeting to discuss pros and cons objectively.',
      'I facilitated a vote based on project requirements.',
      'The team agreed on a hybrid approach.',
      'This improved collaboration for the rest of the project.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'Two team members disagreed on the tech stack choice. I organized a meeting to discuss pros and cons objectively. I facilitated a vote based on project requirements. The team agreed on a hybrid approach. This improved collaboration for the rest of the project.',
    explanation: 'Present the conflict, your initiative, the process, resolution, and positive outcome.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-i3',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'How do you handle tight deadlines?',
    blocks: [
      'I prioritize tasks based on impact and urgency.',
      'I break down complex work into manageable milestones.',
      'I communicate proactively with stakeholders about progress.',
      'This approach helped me deliver a critical feature 2 days early.',
    ],
    correctOrder: [0, 1, 2, 3],
    idealAnswer: 'I prioritize tasks based on impact and urgency. I break down complex work into manageable milestones. I communicate proactively with stakeholders about progress. This approach helped me deliver a critical feature 2 days early.',
    explanation: 'Show your methodology, explain process, demonstrate communication, and provide results.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-i4',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'Describe a time you failed and what you learned.',
    blocks: [
      'I once deployed code without thorough testing.',
      'This caused a production bug affecting user experience.',
      'I immediately rolled back and fixed the issue.',
      'I then implemented a mandatory code review process.',
      'This failure taught me the importance of quality gates.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'I once deployed code without thorough testing. This caused a production bug affecting user experience. I immediately rolled back and fixed the issue. I then implemented a mandatory code review process. This failure taught me the importance of quality gates.',
    explanation: 'Acknowledge the mistake, explain impact, describe immediate action, show improvement, and share learning.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-i5',
    pool: 'technical',
    difficulty: 'intermediate',
    interviewQuestion: 'How do you stay updated with technology trends?',
    blocks: [
      'I dedicate time each week to learning new technologies.',
      'I follow tech blogs, podcasts, and official documentation.',
      'I build side projects to apply new concepts practically.',
      'Recently, I learned Docker through a personal project.',
      'This approach keeps my skills relevant and sharp.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'I dedicate time each week to learning new technologies. I follow tech blogs, podcasts, and official documentation. I build side projects to apply new concepts practically. Recently, I learned Docker through a personal project. This approach keeps my skills relevant and sharp.',
    explanation: 'Show commitment, list resources, explain practical application, give example, and summarize benefit.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-i6',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'Tell me about a time you went above and beyond.',
    blocks: [
      'A client needed an urgent feature over the weekend.',
      'I volunteered to work extra hours to meet their deadline.',
      'I also documented the feature thoroughly for the team.',
      'The client was impressed and renewed their contract.',
      'This reinforced my commitment to customer satisfaction.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'A client needed an urgent feature over the weekend. I volunteered to work extra hours to meet their deadline. I also documented the feature thoroughly for the team. The client was impressed and renewed their contract. This reinforced my commitment to customer satisfaction.',
    explanation: 'Set the scene, describe extra effort, add extra value, show business impact, and reflect.',
    skillFocus: 'communication',
  },

  // ========== ADVANCED (6 questions) ==========
  {
    id: 'ab-a1',
    pool: 'technical',
    difficulty: 'advanced',
    interviewQuestion: 'Explain how you would optimize a slow API.',
    blocks: [
      'First, I would profile the API to identify bottlenecks.',
      'I\'d analyze database queries for N+1 problems.',
      'Implementing caching with Redis would reduce repeated calls.',
      'I\'d add pagination for large datasets.',
      'Finally, I\'d set up monitoring to track improvements.',
      'This systematic approach typically yields 60-80% performance gains.',
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    idealAnswer: 'First, I would profile the API to identify bottlenecks. I\'d analyze database queries for N+1 problems. Implementing caching with Redis would reduce repeated calls. I\'d add pagination for large datasets. Finally, I\'d set up monitoring to track improvements. This systematic approach typically yields 60-80% performance gains.',
    explanation: 'Start with diagnosis, move through solutions logically, and quantify expected results.',
    skillFocus: 'technical',
  },
  {
    id: 'ab-a2',
    pool: 'technical',
    difficulty: 'advanced',
    interviewQuestion: 'Describe your approach to system design.',
    blocks: [
      'I start by clarifying requirements and constraints.',
      'Then I identify core components and their interactions.',
      'I consider scalability from the beginning.',
      'I design for failure with redundancy and fallbacks.',
      'Finally, I document decisions and trade-offs.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'I start by clarifying requirements and constraints. Then I identify core components and their interactions. I consider scalability from the beginning. I design for failure with redundancy and fallbacks. Finally, I document decisions and trade-offs.',
    explanation: 'Requirements first, then architecture, scalability, resilience, and documentation.',
    skillFocus: 'technical',
  },
  {
    id: 'ab-a3',
    pool: 'technical',
    difficulty: 'advanced',
    interviewQuestion: 'How would you debug a production issue?',
    blocks: [
      'I\'d first reproduce the issue in a staging environment.',
      'Check logs and monitoring dashboards for anomalies.',
      'Isolate the problem by narrowing down components.',
      'Apply a fix and verify in staging.',
      'Deploy with a rollback plan ready.',
      'Conduct a post-mortem to prevent recurrence.',
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    idealAnswer: 'I\'d first reproduce the issue in a staging environment. Check logs and monitoring dashboards for anomalies. Isolate the problem by narrowing down components. Apply a fix and verify in staging. Deploy with a rollback plan ready. Conduct a post-mortem to prevent recurrence.',
    explanation: 'Safe reproduction, investigation, isolation, fix, careful deployment, and learning.',
    skillFocus: 'technical',
  },
  {
    id: 'ab-a4',
    pool: 'technical',
    difficulty: 'advanced',
    interviewQuestion: 'How do you handle technical debt?',
    blocks: [
      'I maintain a technical debt register to track issues.',
      'I categorize debt by impact and effort to fix.',
      'I allocate a percentage of each sprint for refactoring.',
      'I communicate trade-offs to stakeholders clearly.',
      'I use automated tools to detect code quality issues.',
      'This balanced approach keeps the codebase maintainable.',
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    idealAnswer: 'I maintain a technical debt register to track issues. I categorize debt by impact and effort to fix. I allocate a percentage of each sprint for refactoring. I communicate trade-offs to stakeholders clearly. I use automated tools to detect code quality issues. This balanced approach keeps the codebase maintainable.',
    explanation: 'Track, prioritize, allocate time, communicate, automate, and summarize strategy.',
    skillFocus: 'technical',
  },
  {
    id: 'ab-a5',
    pool: 'behavioral',
    difficulty: 'advanced',
    interviewQuestion: 'Describe a time you influenced a major technical decision.',
    blocks: [
      'Our team was deciding between microservices and monolith.',
      'I researched both approaches with our specific constraints.',
      'I presented data on deployment complexity and team size.',
      'I recommended a modular monolith as a starting point.',
      'The team adopted my recommendation and we shipped faster.',
      'This taught me to balance idealism with pragmatism.',
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    idealAnswer: 'Our team was deciding between microservices and monolith. I researched both approaches with our specific constraints. I presented data on deployment complexity and team size. I recommended a modular monolith as a starting point. The team adopted my recommendation and we shipped faster. This taught me to balance idealism with pragmatism.',
    explanation: 'Context, research, data-driven analysis, recommendation, outcome, and reflection.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-a6',
    pool: 'technical',
    difficulty: 'advanced',
    interviewQuestion: 'How would you design a notification system?',
    blocks: [
      'I\'d use a message queue for asynchronous processing.',
      'Implement multiple channels: email, push, SMS, in-app.',
      'Create a preference service for user notification settings.',
      'Add rate limiting to prevent notification fatigue.',
      'Use templates with localization support.',
      'Monitor delivery rates and implement retry mechanisms.',
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    idealAnswer: 'I\'d use a message queue for asynchronous processing. Implement multiple channels: email, push, SMS, in-app. Create a preference service for user notification settings. Add rate limiting to prevent notification fatigue. Use templates with localization support. Monitor delivery rates and implement retry mechanisms.',
    explanation: 'Start with architecture, then channels, user control, limits, content, and reliability.',
    skillFocus: 'technical',
  },
];

// ============================================
// KEYWORD MAPPING QUESTIONS (18 total - 6 per difficulty)
// ============================================

export const keywordMappingQuestionsExpanded: KeywordMappingQuestion[] = [
  // ========== BEGINNER (6 questions) ==========
  {
    id: 'km-b1',
    pool: 'technical',
    difficulty: 'beginner',
    topic: 'REST API Fundamentals',
    keywords: ['HTTP methods', 'endpoints', 'stateless', 'resources'],
    sentences: [
      { id: 's1', text: 'REST APIs use HTTP methods like GET and POST to interact with resources.', isCorrect: true, explanation: 'Correctly uses HTTP methods and resources.' },
      { id: 's2', text: 'Each REST endpoint represents a specific resource in the system.', isCorrect: true, explanation: 'Correctly explains endpoints and resources.' },
      { id: 's3', text: 'REST APIs maintain session state on the server for each client.', isCorrect: false, explanation: 'REST is stateless - servers don\'t maintain client state.' },
      { id: 's4', text: 'Stateless design means each request contains all necessary information.', isCorrect: true, explanation: 'Correctly defines stateless architecture.' },
      { id: 's5', text: 'REST APIs require WebSocket connections for all communications.', isCorrect: false, explanation: 'REST uses HTTP, not WebSocket connections.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-b2',
    pool: 'technical',
    difficulty: 'beginner',
    topic: 'Version Control Basics',
    keywords: ['commit', 'branch', 'merge', 'repository'],
    sentences: [
      { id: 's1', text: 'A commit captures a snapshot of your project at a specific point.', isCorrect: true, explanation: 'Correctly describes commit functionality.' },
      { id: 's2', text: 'Branches allow parallel development without affecting main code.', isCorrect: true, explanation: 'Correctly explains branching concept.' },
      { id: 's3', text: 'Merging combines changes from one branch into another.', isCorrect: true, explanation: 'Correctly defines merge operation.' },
      { id: 's4', text: 'A repository stores only the latest version of files.', isCorrect: false, explanation: 'Repositories store complete history of all versions.' },
      { id: 's5', text: 'Commits should always include all project files at once.', isCorrect: false, explanation: 'Commits should be atomic and focused on specific changes.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-b3',
    pool: 'hr',
    difficulty: 'beginner',
    topic: 'Teamwork Skills',
    keywords: ['collaboration', 'communication', 'feedback', 'support'],
    sentences: [
      { id: 's1', text: 'Effective collaboration requires clear and open communication.', isCorrect: true, explanation: 'Links collaboration and communication correctly.' },
      { id: 's2', text: 'Giving constructive feedback helps team members improve.', isCorrect: true, explanation: 'Correctly connects feedback with team growth.' },
      { id: 's3', text: 'Good teammates work independently without consulting others.', isCorrect: false, explanation: 'Teamwork requires collaboration, not isolation.' },
      { id: 's4', text: 'Supporting colleagues during challenges strengthens team bonds.', isCorrect: true, explanation: 'Correctly identifies support as a team value.' },
      { id: 's5', text: 'Communication should be limited to formal meetings only.', isCorrect: false, explanation: 'Good communication happens continuously, not just in meetings.' },
    ],
    skillFocus: 'communication',
  },
  {
    id: 'km-b4',
    pool: 'technical',
    difficulty: 'beginner',
    topic: 'HTML & CSS Basics',
    keywords: ['elements', 'selectors', 'styling', 'layout'],
    sentences: [
      { id: 's1', text: 'HTML elements define the structure and content of web pages.', isCorrect: true, explanation: 'Correctly describes HTML elements.' },
      { id: 's2', text: 'CSS selectors target HTML elements for styling.', isCorrect: true, explanation: 'Correctly explains CSS selectors.' },
      { id: 's3', text: 'CSS is used to add interactivity to web pages.', isCorrect: false, explanation: 'CSS handles styling; JavaScript handles interactivity.' },
      { id: 's4', text: 'Flexbox and Grid are CSS layout systems.', isCorrect: true, explanation: 'Correctly identifies CSS layout tools.' },
      { id: 's5', text: 'HTML styling should be done using inline styles only.', isCorrect: false, explanation: 'External CSS is preferred for maintainability.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-b5',
    pool: 'technical',
    difficulty: 'beginner',
    topic: 'JavaScript Basics',
    keywords: ['variables', 'functions', 'arrays', 'objects'],
    sentences: [
      { id: 's1', text: 'Variables store data values that can be used throughout your code.', isCorrect: true, explanation: 'Correctly defines variables.' },
      { id: 's2', text: 'Functions are reusable blocks of code that perform specific tasks.', isCorrect: true, explanation: 'Correctly describes functions.' },
      { id: 's3', text: 'Arrays can only store numbers in JavaScript.', isCorrect: false, explanation: 'Arrays can store any data type.' },
      { id: 's4', text: 'Objects store data as key-value pairs.', isCorrect: true, explanation: 'Correctly defines objects.' },
      { id: 's5', text: 'JavaScript is a compiled language like C++.', isCorrect: false, explanation: 'JavaScript is an interpreted language.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-b6',
    pool: 'hr',
    difficulty: 'beginner',
    topic: 'Professional Communication',
    keywords: ['clarity', 'active listening', 'concise', 'respectful'],
    sentences: [
      { id: 's1', text: 'Clear communication reduces misunderstandings in the workplace.', isCorrect: true, explanation: 'Links clarity with effective communication.' },
      { id: 's2', text: 'Active listening involves paying attention and asking follow-up questions.', isCorrect: true, explanation: 'Correctly defines active listening.' },
      { id: 's3', text: 'Using technical jargon always makes you sound more professional.', isCorrect: false, explanation: 'Over-using jargon can confuse others.' },
      { id: 's4', text: 'Being concise means getting to the point without unnecessary details.', isCorrect: true, explanation: 'Correctly defines concise communication.' },
      { id: 's5', text: 'Respectful communication maintains professionalism even in disagreements.', isCorrect: true, explanation: 'Correctly links respect with professionalism.' },
    ],
    skillFocus: 'communication',
  },

  // ========== INTERMEDIATE (6 questions) ==========
  {
    id: 'km-i1',
    pool: 'technical',
    difficulty: 'intermediate',
    topic: 'Database Optimization',
    keywords: ['indexing', 'query optimization', 'normalization', 'caching'],
    sentences: [
      { id: 's1', text: 'Proper indexing significantly improves query performance on large tables.', isCorrect: true, explanation: 'Correctly explains indexing benefit.' },
      { id: 's2', text: 'Caching frequently accessed data reduces database load.', isCorrect: true, explanation: 'Correctly describes caching purpose.' },
      { id: 's3', text: 'Normalization always improves query speed.', isCorrect: false, explanation: 'Normalization improves data integrity but may require JOINs that slow queries.' },
      { id: 's4', text: 'Query optimization involves analyzing and improving execution plans.', isCorrect: true, explanation: 'Correctly defines query optimization.' },
      { id: 's5', text: 'Adding indexes to every column maximizes performance.', isCorrect: false, explanation: 'Over-indexing slows writes and wastes storage.' },
      { id: 's6', text: 'Denormalization can improve read performance for specific use cases.', isCorrect: true, explanation: 'Correctly identifies denormalization trade-off.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-i2',
    pool: 'behavioral',
    difficulty: 'intermediate',
    topic: 'Project Management',
    keywords: ['prioritization', 'stakeholders', 'milestones', 'risk assessment'],
    sentences: [
      { id: 's1', text: 'Prioritization helps focus on high-impact tasks first.', isCorrect: true, explanation: 'Correctly explains prioritization value.' },
      { id: 's2', text: 'Stakeholder communication ensures alignment on expectations.', isCorrect: true, explanation: 'Correctly links stakeholders with communication.' },
      { id: 's3', text: 'Risk assessment should only happen at project end.', isCorrect: false, explanation: 'Risk assessment is ongoing throughout the project.' },
      { id: 's4', text: 'Milestones provide checkpoints to measure progress.', isCorrect: true, explanation: 'Correctly defines milestone purpose.' },
      { id: 's5', text: 'Good project managers avoid involving stakeholders in decisions.', isCorrect: false, explanation: 'Stakeholder involvement is essential for project success.' },
    ],
    skillFocus: 'communication',
  },
  {
    id: 'km-i3',
    pool: 'technical',
    difficulty: 'intermediate',
    topic: 'Microservices Architecture',
    keywords: ['decoupling', 'scalability', 'API gateway', 'service discovery'],
    sentences: [
      { id: 's1', text: 'Decoupling services allows independent deployment and scaling.', isCorrect: true, explanation: 'Correctly explains decoupling benefit.' },
      { id: 's2', text: 'An API gateway provides a single entry point for client requests.', isCorrect: true, explanation: 'Correctly describes API gateway function.' },
      { id: 's3', text: 'Service discovery enables dynamic service location in distributed systems.', isCorrect: true, explanation: 'Correctly defines service discovery.' },
      { id: 's4', text: 'Microservices should share a single database for consistency.', isCorrect: false, explanation: 'Each microservice should own its data store.' },
      { id: 's5', text: 'Scalability in microservices means scaling individual services as needed.', isCorrect: true, explanation: 'Correctly explains microservices scalability.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-i4',
    pool: 'technical',
    difficulty: 'intermediate',
    topic: 'React State Management',
    keywords: ['useState', 'useEffect', 'props', 'context'],
    sentences: [
      { id: 's1', text: 'useState hook manages local component state in React.', isCorrect: true, explanation: 'Correctly describes useState.' },
      { id: 's2', text: 'useEffect handles side effects like data fetching and subscriptions.', isCorrect: true, explanation: 'Correctly explains useEffect purpose.' },
      { id: 's3', text: 'Props should be modified directly by child components.', isCorrect: false, explanation: 'Props are read-only; use callbacks to update parent state.' },
      { id: 's4', text: 'Context API helps share state across components without prop drilling.', isCorrect: true, explanation: 'Correctly describes Context API benefit.' },
      { id: 's5', text: 'State updates in React are always synchronous.', isCorrect: false, explanation: 'React batches state updates and they are asynchronous.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-i5',
    pool: 'technical',
    difficulty: 'intermediate',
    topic: 'Testing Strategies',
    keywords: ['unit tests', 'integration tests', 'mocking', 'test coverage'],
    sentences: [
      { id: 's1', text: 'Unit tests verify individual functions or components in isolation.', isCorrect: true, explanation: 'Correctly defines unit tests.' },
      { id: 's2', text: 'Integration tests check how multiple components work together.', isCorrect: true, explanation: 'Correctly describes integration tests.' },
      { id: 's3', text: 'Mocking replaces real dependencies with controlled test doubles.', isCorrect: true, explanation: 'Correctly explains mocking.' },
      { id: 's4', text: '100% test coverage guarantees bug-free code.', isCorrect: false, explanation: 'Coverage measures lines tested, not quality of tests.' },
      { id: 's5', text: 'Integration tests should replace unit tests entirely.', isCorrect: false, explanation: 'Both test types serve different purposes and complement each other.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-i6',
    pool: 'behavioral',
    difficulty: 'intermediate',
    topic: 'Problem-Solving Approach',
    keywords: ['analysis', 'breakdown', 'iteration', 'validation'],
    sentences: [
      { id: 's1', text: 'Breaking down complex problems makes them more manageable.', isCorrect: true, explanation: 'Correctly describes problem breakdown.' },
      { id: 's2', text: 'Thorough analysis helps identify the root cause of issues.', isCorrect: true, explanation: 'Correctly explains analysis importance.' },
      { id: 's3', text: 'The first solution is always the best solution.', isCorrect: false, explanation: 'Iteration often leads to better solutions.' },
      { id: 's4', text: 'Validating solutions ensures they actually solve the problem.', isCorrect: true, explanation: 'Correctly identifies validation importance.' },
      { id: 's5', text: 'Iteration allows refining solutions based on feedback.', isCorrect: true, explanation: 'Correctly describes iterative improvement.' },
    ],
    skillFocus: 'communication',
  },

  // ========== ADVANCED (6 questions) ==========
  {
    id: 'km-a1',
    pool: 'technical',
    difficulty: 'advanced',
    topic: 'Distributed Systems',
    keywords: ['CAP theorem', 'eventual consistency', 'partition tolerance', 'consensus'],
    sentences: [
      { id: 's1', text: 'CAP theorem states you can only guarantee two of three properties.', isCorrect: true, explanation: 'Correctly states CAP theorem limitation.' },
      { id: 's2', text: 'Eventual consistency means all nodes will converge to the same state.', isCorrect: true, explanation: 'Correctly defines eventual consistency.' },
      { id: 's3', text: 'Partition tolerance allows the system to operate despite network failures.', isCorrect: true, explanation: 'Correctly explains partition tolerance.' },
      { id: 's4', text: 'Strong consistency is always preferable to eventual consistency.', isCorrect: false, explanation: 'Trade-offs depend on system requirements.' },
      { id: 's5', text: 'Consensus algorithms ensure all nodes agree on system state.', isCorrect: true, explanation: 'Correctly describes consensus purpose.' },
      { id: 's6', text: 'Distributed systems can achieve perfect consistency and availability simultaneously.', isCorrect: false, explanation: 'CAP theorem proves this is impossible during partitions.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-a2',
    pool: 'behavioral',
    difficulty: 'advanced',
    topic: 'Technical Leadership',
    keywords: ['mentorship', 'architecture decisions', 'technical debt', 'team growth'],
    sentences: [
      { id: 's1', text: 'Effective mentorship accelerates team skill development.', isCorrect: true, explanation: 'Correctly links mentorship with growth.' },
      { id: 's2', text: 'Architecture decisions should consider long-term maintainability.', isCorrect: true, explanation: 'Correctly identifies architecture consideration.' },
      { id: 's3', text: 'Technical debt should always be avoided at all costs.', isCorrect: false, explanation: 'Strategic technical debt can be acceptable for business goals.' },
      { id: 's4', text: 'Leaders should make all technical decisions without team input.', isCorrect: false, explanation: 'Good leaders involve teams in decisions.' },
      { id: 's5', text: 'Investing in team growth improves long-term productivity.', isCorrect: true, explanation: 'Correctly identifies team development value.' },
      { id: 's6', text: 'Managing technical debt involves balancing new features with refactoring.', isCorrect: true, explanation: 'Correctly describes technical debt management.' },
    ],
    skillFocus: 'communication',
  },
  {
    id: 'km-a3',
    pool: 'technical',
    difficulty: 'advanced',
    topic: 'Security Best Practices',
    keywords: ['authentication', 'authorization', 'encryption', 'OWASP'],
    sentences: [
      { id: 's1', text: 'Authentication verifies user identity before granting access.', isCorrect: true, explanation: 'Correctly defines authentication.' },
      { id: 's2', text: 'Authorization determines what authenticated users can do.', isCorrect: true, explanation: 'Correctly explains authorization.' },
      { id: 's3', text: 'Encryption protects data at rest and in transit.', isCorrect: true, explanation: 'Correctly describes encryption scope.' },
      { id: 's4', text: 'OWASP provides guidance on common security vulnerabilities.', isCorrect: true, explanation: 'Correctly identifies OWASP purpose.' },
      { id: 's5', text: 'Client-side validation is sufficient for security.', isCorrect: false, explanation: 'Server-side validation is essential; client-side can be bypassed.' },
      { id: 's6', text: 'Storing passwords in plain text is acceptable for internal tools.', isCorrect: false, explanation: 'Passwords should always be hashed securely.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-a4',
    pool: 'technical',
    difficulty: 'advanced',
    topic: 'System Design Patterns',
    keywords: ['load balancing', 'caching layers', 'CDN', 'database sharding'],
    sentences: [
      { id: 's1', text: 'Load balancing distributes traffic across multiple servers.', isCorrect: true, explanation: 'Correctly defines load balancing.' },
      { id: 's2', text: 'Caching layers reduce latency by storing frequently accessed data.', isCorrect: true, explanation: 'Correctly explains caching purpose.' },
      { id: 's3', text: 'CDNs serve static content from geographically distributed servers.', isCorrect: true, explanation: 'Correctly describes CDN function.' },
      { id: 's4', text: 'Database sharding always simplifies application logic.', isCorrect: false, explanation: 'Sharding adds complexity for cross-shard queries.' },
      { id: 's5', text: 'Vertical scaling is unlimited and always preferred.', isCorrect: false, explanation: 'Hardware has limits; horizontal scaling offers more flexibility.' },
      { id: 's6', text: 'Read replicas improve read performance by distributing load.', isCorrect: true, explanation: 'Correctly explains read replica benefit.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-a5',
    pool: 'technical',
    difficulty: 'advanced',
    topic: 'CI/CD & DevOps',
    keywords: ['continuous integration', 'deployment pipelines', 'infrastructure as code', 'monitoring'],
    sentences: [
      { id: 's1', text: 'CI automatically builds and tests code on every commit.', isCorrect: true, explanation: 'Correctly defines continuous integration.' },
      { id: 's2', text: 'Deployment pipelines automate the release process.', isCorrect: true, explanation: 'Correctly describes deployment pipelines.' },
      { id: 's3', text: 'Infrastructure as code enables version-controlled infrastructure.', isCorrect: true, explanation: 'Correctly explains IaC benefit.' },
      { id: 's4', text: 'Monitoring should only be set up after production issues occur.', isCorrect: false, explanation: 'Proactive monitoring prevents issues before they impact users.' },
      { id: 's5', text: 'Feature flags allow gradual rollouts and quick rollbacks.', isCorrect: true, explanation: 'Correctly identifies feature flag benefits.' },
      { id: 's6', text: 'Automated deployments eliminate all risk of production issues.', isCorrect: false, explanation: 'Automation reduces but doesn\'t eliminate risk.' },
    ],
    skillFocus: 'technical',
  },
  {
    id: 'km-a6',
    pool: 'behavioral',
    difficulty: 'advanced',
    topic: 'Strategic Decision Making',
    keywords: ['trade-offs', 'stakeholder alignment', 'risk mitigation', 'data-driven'],
    sentences: [
      { id: 's1', text: 'Understanding trade-offs helps make balanced technical decisions.', isCorrect: true, explanation: 'Correctly links trade-offs with decision quality.' },
      { id: 's2', text: 'Stakeholder alignment ensures everyone understands the chosen direction.', isCorrect: true, explanation: 'Correctly explains alignment importance.' },
      { id: 's3', text: 'Risk mitigation identifies and reduces potential negative outcomes.', isCorrect: true, explanation: 'Correctly defines risk mitigation.' },
      { id: 's4', text: 'Data-driven decisions are always better than intuition.', isCorrect: false, explanation: 'Data informs decisions but experience and context matter too.' },
      { id: 's5', text: 'The fastest solution is always the best business decision.', isCorrect: false, explanation: 'Speed must be balanced with quality and maintainability.' },
      { id: 's6', text: 'Documenting decisions helps future teams understand context.', isCorrect: true, explanation: 'Correctly identifies documentation value.' },
    ],
    skillFocus: 'communication',
  },
];

// ============================================
// TRUTH OR BLUFF STATEMENTS (30 total - 10 per difficulty)
// ============================================

export const truthOrBluffStatementsExpanded: TruthOrBluffStatement[] = [
  // ========== BEGINNER (10 statements) ==========
  {
    id: 'tob-b1',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'JavaScript',
    statement: 'JavaScript is a statically typed language.',
    answer: 'incorrect',
    explanation: 'JavaScript is dynamically typed. TypeScript adds static typing on top of JavaScript.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b2',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'Web Development',
    statement: 'HTML is used for structuring web page content.',
    answer: 'correct',
    explanation: 'HTML (HyperText Markup Language) defines the structure and content of web pages.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b3',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'CSS',
    statement: 'CSS can be used to add interactivity to websites.',
    answer: 'misleading',
    explanation: 'CSS can create animations and hover effects, but true interactivity requires JavaScript.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b4',
    pool: 'hr',
    difficulty: 'beginner',
    category: 'Interview Tips',
    statement: 'Arriving 5-10 minutes early to an interview shows professionalism.',
    answer: 'correct',
    explanation: 'Being slightly early demonstrates respect for the interviewer\'s time and good planning.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-b5',
    pool: 'hr',
    difficulty: 'beginner',
    category: 'Interview Tips',
    statement: 'You should never ask questions at the end of an interview.',
    answer: 'incorrect',
    explanation: 'Asking thoughtful questions shows interest and engagement with the role.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-b6',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'Git',
    statement: 'Git and GitHub are the same thing.',
    answer: 'incorrect',
    explanation: 'Git is a version control system; GitHub is a cloud platform that hosts Git repositories.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b7',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'Programming',
    statement: 'An array can store multiple values of different types in JavaScript.',
    answer: 'correct',
    explanation: 'JavaScript arrays are flexible and can hold mixed data types.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b8',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'Web Development',
    statement: 'HTTP status code 404 means the server crashed.',
    answer: 'incorrect',
    explanation: '404 means "Not Found" - the requested resource doesn\'t exist. Server crashes typically return 500.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-b9',
    pool: 'hr',
    difficulty: 'beginner',
    category: 'Resume Tips',
    statement: 'Your resume should be exactly one page for entry-level positions.',
    answer: 'misleading',
    explanation: 'One page is generally recommended but relevant content matters more than strict page limits.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-b10',
    pool: 'technical',
    difficulty: 'beginner',
    category: 'Databases',
    statement: 'SQL stands for Structured Query Language.',
    answer: 'correct',
    explanation: 'SQL is indeed Structured Query Language, used for managing relational databases.',
    skillFocus: 'technical',
  },

  // ========== INTERMEDIATE (10 statements) ==========
  {
    id: 'tob-i1',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'React',
    statement: 'React components re-render whenever their parent component re-renders.',
    answer: 'misleading',
    explanation: 'By default yes, but React.memo() and useMemo() can prevent unnecessary re-renders.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i2',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'Databases',
    statement: 'NoSQL databases cannot handle relationships between data.',
    answer: 'misleading',
    explanation: 'NoSQL can handle relationships through embedding or references, but not as efficiently as relational DBs.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i3',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'API Design',
    statement: 'REST APIs must always return JSON responses.',
    answer: 'incorrect',
    explanation: 'REST APIs can return any format including XML, HTML, or plain text. JSON is just common.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i4',
    pool: 'behavioral',
    difficulty: 'intermediate',
    category: 'STAR Method',
    statement: 'The STAR method is only useful for behavioral interview questions.',
    answer: 'misleading',
    explanation: 'While designed for behavioral questions, STAR structure helps organize any experience-based answer.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-i5',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'Testing',
    statement: 'Unit tests should test multiple components together for efficiency.',
    answer: 'incorrect',
    explanation: 'Unit tests should test individual units in isolation. Integration tests cover multiple components.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i6',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'DevOps',
    statement: 'CI/CD pipelines automatically deploy code without any human intervention.',
    answer: 'misleading',
    explanation: 'CD can be fully automated, but many teams use manual approval gates for production deployments.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i7',
    pool: 'behavioral',
    difficulty: 'intermediate',
    category: 'Salary Negotiation',
    statement: 'You should always accept the first salary offer to avoid seeming greedy.',
    answer: 'incorrect',
    explanation: 'Negotiating salary is expected and professional when done respectfully with market data.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-i8',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'Node.js',
    statement: 'Node.js is single-threaded and cannot handle concurrent requests.',
    answer: 'misleading',
    explanation: 'Node.js uses single-threaded event loop but handles concurrency through async I/O efficiently.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i9',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'TypeScript',
    statement: 'TypeScript code runs directly in the browser.',
    answer: 'incorrect',
    explanation: 'TypeScript must be compiled to JavaScript before running in browsers.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-i10',
    pool: 'technical',
    difficulty: 'intermediate',
    category: 'APIs',
    statement: 'GraphQL always performs better than REST.',
    answer: 'incorrect',
    explanation: 'Performance depends on use case. GraphQL excels at flexible queries but has overhead for simple requests.',
    skillFocus: 'technical',
  },

  // ========== ADVANCED (10 statements) ==========
  {
    id: 'tob-a1',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'System Design',
    statement: 'Horizontal scaling is always better than vertical scaling.',
    answer: 'misleading',
    explanation: 'It depends on the use case. Vertical scaling is simpler and suits some workloads better.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a2',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Microservices',
    statement: 'Microservices architecture reduces system complexity.',
    answer: 'misleading',
    explanation: 'Microservices trade code complexity for operational complexity. Total complexity often increases.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a3',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Security',
    statement: 'HTTPS encrypts all data in a web request including the URL.',
    answer: 'misleading',
    explanation: 'HTTPS encrypts the body and headers, but the domain name is visible during DNS lookup and TLS handshake.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a4',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Databases',
    statement: 'ACID compliance guarantees zero data loss in all scenarios.',
    answer: 'misleading',
    explanation: 'ACID ensures transaction integrity, but hardware failures or disasters can still cause data loss.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a5',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Concurrency',
    statement: 'Async/await makes JavaScript code run in parallel.',
    answer: 'incorrect',
    explanation: 'JavaScript is single-threaded. Async/await handles concurrency, not parallelism.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a6',
    pool: 'behavioral',
    difficulty: 'advanced',
    category: 'Leadership',
    statement: 'A good technical leader should be the best coder on the team.',
    answer: 'misleading',
    explanation: 'Technical competence helps, but leadership skills, mentorship, and vision matter more.',
    skillFocus: 'communication',
  },
  {
    id: 'tob-a7',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Architecture',
    statement: 'Event-driven architecture eliminates the need for synchronous communication.',
    answer: 'incorrect',
    explanation: 'Many operations still require synchronous calls. Event-driven is best for specific use cases.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a8',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Performance',
    statement: 'Caching always improves application performance.',
    answer: 'misleading',
    explanation: 'Improper caching can cause stale data issues and cache invalidation adds complexity.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a9',
    pool: 'technical',
    difficulty: 'advanced',
    category: 'Kubernetes',
    statement: 'Kubernetes automatically fixes all application bugs.',
    answer: 'incorrect',
    explanation: 'Kubernetes manages containers but cannot fix application logic bugs - only restart failed containers.',
    skillFocus: 'technical',
  },
  {
    id: 'tob-a10',
    pool: 'behavioral',
    difficulty: 'advanced',
    category: 'Architecture Decisions',
    statement: 'You should always choose the latest technology for new projects.',
    answer: 'incorrect',
    explanation: 'Technology choices should be based on team expertise, community support, and project needs.',
    skillFocus: 'communication',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getFilteredQuestionsExpanded = <T extends { difficulty: DifficultyLevel; pool?: QuestionPool }>(
  questions: T[],
  difficulty?: DifficultyLevel,
  pool?: QuestionPool
): T[] => {
  let filtered = [...questions];
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  if (pool) {
    filtered = filtered.filter(q => q.pool === pool);
  }
  
return filtered;
};

export const getRandomQuestionExpanded = <T extends { id: string }>(
  questions: T[],
  usedIds: string[]
): T | null => {
  // Filter out recently used questions
  const available = questions.filter(q => !usedIds.includes(q.id));
  
  // If all questions used, reset and pick from full pool
  if (available.length === 0) {
    if (questions.length === 0) {return null;}
    
return questions[Math.floor(Math.random() * questions.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};

// Check if all questions for a difficulty have been used
export const allQuestionsUsed = <T extends { id: string; difficulty: DifficultyLevel }>(
  questions: T[],
  difficulty: DifficultyLevel,
  usedIds: string[]
): boolean => {
  const filtered = questions.filter(q => q.difficulty === difficulty);
  
return filtered.every(q => usedIds.includes(q.id));
};

// Get count of remaining questions
export const getRemainingQuestionCount = <T extends { id: string; difficulty: DifficultyLevel }>(
  questions: T[],
  difficulty: DifficultyLevel,
  usedIds: string[]
): number => {
  const filtered = questions.filter(q => q.difficulty === difficulty);
  
return filtered.filter(q => !usedIds.includes(q.id)).length;
};

// Get total question count for a difficulty
export const getTotalQuestionCount = <T extends { difficulty: DifficultyLevel }>(
  questions: T[],
  difficulty: DifficultyLevel
): number => {
  return questions.filter(q => q.difficulty === difficulty).length;
};
