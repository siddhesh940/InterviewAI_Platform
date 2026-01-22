// src/data/games-data.ts
// Enterprise-grade Question Pool System for Training Games

import { DifficultyLevel, GameId, QuestionPool, SkillCategory } from '@/contexts/GamesContext';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface BadAnswerQuestion {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  badAnswer: string;
  context?: string; // What question was asked
  idealAnswer: string;
  keywords: string[];
  skillFocus: SkillCategory;
}

export interface KeywordTopic {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  title: string;
  keywords: string[];
  bonusKeywords: string[];
  category: string;
  timeLimit: number; // seconds
}

export interface RephraseSentence {
  id: string;
  pool: QuestionPool;
  difficulty: DifficultyLevel;
  original: string;
  idealRewrite: string;
  keyImprovements: string[];
  skillFocus: SkillCategory;
}

export interface GameConfig {
  id: GameId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  skillCategory: SkillCategory;
  estimatedTime: string;
  difficultySettings: {
    beginner: { scoringStrictness: number; timeBonus: number };
    intermediate: { scoringStrictness: number; timeBonus: number };
    advanced: { scoringStrictness: number; timeBonus: number };
  };
}

// ============================================
// GAME CONFIGURATIONS
// ============================================

export const gameConfigs: Record<GameId, GameConfig> = {
  'fix-bad-answer': {
    id: 'fix-bad-answer',
    name: 'Fix the Bad Answer',
    subtitle: 'Correction Challenge',
    description: 'Transform weak interview responses into professional, structured answers using STAR method.',
    icon: 'Edit3',
    color: 'indigo',
    skillCategory: 'communication',
    estimatedTime: '15 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.7, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.2 },
      advanced: { scoringStrictness: 1.3, timeBonus: 1.5 },
    },
  },
  'keyword-hunt': {
    id: 'keyword-hunt',
    name: 'Keyword Hunt',
    subtitle: 'Fast Technical Recall',
    description: 'Test your technical vocabulary under pressure. Build strong conceptual memory.',
    icon: 'Clock',
    color: 'purple',
    skillCategory: 'technical',
    estimatedTime: '5 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.8, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.3 },
      advanced: { scoringStrictness: 1.2, timeBonus: 1.6 },
    },
  },
  'rephrase-me': {
    id: 'rephrase-me',
    name: 'Rephrase Me',
    subtitle: 'Vocabulary Builder',
    description: 'Transform basic statements into polished, professional interview-ready language.',
    icon: 'BookOpen',
    color: 'emerald',
    skillCategory: 'communication',
    estimatedTime: '10 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.7, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.2 },
      advanced: { scoringStrictness: 1.3, timeBonus: 1.5 },
    },
  },
  'answer-builder': {
    id: 'answer-builder',
    name: 'Answer Builder',
    subtitle: 'Sentence Construction',
    description: 'Arrange sentence blocks in the correct order to build professional interview answers.',
    icon: 'Layers',
    color: 'blue',
    skillCategory: 'communication',
    estimatedTime: '12 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.7, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.2 },
      advanced: { scoringStrictness: 1.3, timeBonus: 1.5 },
    },
  },
  'keyword-mapping': {
    id: 'keyword-mapping',
    name: 'Keyword Mapping',
    subtitle: 'Concept Matching',
    description: 'Match technical keywords with correct statements to test your conceptual understanding.',
    icon: 'Link',
    color: 'teal',
    skillCategory: 'technical',
    estimatedTime: '8 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.8, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.3 },
      advanced: { scoringStrictness: 1.2, timeBonus: 1.6 },
    },
  },
  'truth-or-bluff': {
    id: 'truth-or-bluff',
    name: 'Truth or Bluff',
    subtitle: 'Fact Verification',
    description: 'Identify whether technical statements are correct, incorrect, or misleading.',
    icon: 'CheckCircle',
    color: 'rose',
    skillCategory: 'technical',
    estimatedTime: '10 mins',
    difficultySettings: {
      beginner: { scoringStrictness: 0.8, timeBonus: 1.0 },
      intermediate: { scoringStrictness: 1.0, timeBonus: 1.2 },
      advanced: { scoringStrictness: 1.2, timeBonus: 1.5 },
    },
  }
};

// ============================================
// FIX BAD ANSWER - QUESTION POOLS
// ============================================

export const badAnswerQuestions: BadAnswerQuestion[] = [
  // HR Pool - Beginner
  {
    id: 'ba-hr-b1',
    pool: 'hr',
    difficulty: 'beginner',
    badAnswer: "I don't know much about it, honestly.",
    context: "Tell me about yourself",
    idealAnswer: "I'm a dedicated professional with a strong foundation in [field]. I've developed my expertise through academic projects and practical experience, focusing on continuous learning and skill development.",
    keywords: ['dedicated', 'professional', 'expertise', 'experience'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-hr-b2',
    pool: 'hr',
    difficulty: 'beginner',
    badAnswer: "I'm not sure why I applied, just trying things.",
    context: "Why do you want to work here?",
    idealAnswer: "I applied because your company's mission aligns with my career goals. I'm impressed by your innovative approach and believe my skills can contribute meaningfully to your team's success.",
    keywords: ['mission', 'aligned', 'contribute', 'impressed'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-hr-b3',
    pool: 'hr',
    difficulty: 'beginner',
    badAnswer: "I just did whatever my friend told me during the project.",
    context: "Tell me about a project you worked on",
    idealAnswer: "I collaborated with my team on a project where I took initiative in specific areas while learning from my teammates. This experience taught me the value of both leadership and being receptive to guidance.",
    keywords: ['collaborated', 'initiative', 'leadership', 'learning'],
    skillFocus: 'communication',
  },

  // HR Pool - Intermediate
  {
    id: 'ba-hr-i1',
    pool: 'hr',
    difficulty: 'intermediate',
    badAnswer: "I get bored easily, so I switch things a lot.",
    context: "What are your strengths and weaknesses?",
    idealAnswer: "I thrive on variety and new challenges, which drives me to continuously expand my skill set. I've learned to channel this by setting clear goals and maintaining focus while exploring diverse projects.",
    keywords: ['variety', 'challenges', 'goals', 'focus', 'diverse'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-hr-i2',
    pool: 'hr',
    difficulty: 'intermediate',
    badAnswer: "I didn't really practice anything, just came here.",
    context: "How did you prepare for this interview?",
    idealAnswer: "I researched your company extensively, reviewed the job requirements, and reflected on how my experience aligns with your needs. I also prepared specific examples to demonstrate my capabilities.",
    keywords: ['researched', 'reviewed', 'aligned', 'prepared', 'examples'],
    skillFocus: 'communication',
  },

  // HR Pool - Advanced
  {
    id: 'ba-hr-a1',
    pool: 'hr',
    difficulty: 'advanced',
    badAnswer: "I don't handle pressure well, I get stressed.",
    context: "How do you handle stressful situations?",
    idealAnswer: "I approach high-pressure situations methodically: first, I prioritize tasks by urgency and impact, then break complex problems into manageable steps. I maintain composure by focusing on solutions rather than obstacles, and I've developed techniques like time-blocking to ensure quality delivery even under tight deadlines.",
    keywords: ['methodically', 'prioritize', 'composure', 'solutions', 'techniques'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Beginner
  {
    id: 'ba-bh-b1',
    pool: 'behavioral',
    difficulty: 'beginner',
    badAnswer: "I know basics only, nothing advanced.",
    context: "What technical skills do you have?",
    idealAnswer: "I have a solid foundation in core concepts and am actively expanding my expertise. I believe in continuous learning and have been building on my basics through projects and structured study.",
    keywords: ['foundation', 'expanding', 'continuous', 'building', 'structured'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-bh-b2',
    pool: 'behavioral',
    difficulty: 'beginner',
    badAnswer: "I'm not great at teamwork, I prefer being alone.",
    context: "How do you work in a team?",
    idealAnswer: "I value both independent work and collaboration. While I'm comfortable working autonomously, I recognize the power of diverse perspectives and actively contribute to team discussions while respecting others' viewpoints.",
    keywords: ['collaboration', 'independent', 'diverse', 'perspectives', 'contribute'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Intermediate
  {
    id: 'ba-bh-i1',
    pool: 'behavioral',
    difficulty: 'intermediate',
    badAnswer: "My communication isn't good, but I try.",
    context: "How are your communication skills?",
    idealAnswer: "I'm continuously improving my communication abilities. I focus on active listening, clear articulation of ideas, and adapting my communication style to different audiences. I actively seek feedback to enhance my effectiveness.",
    keywords: ['improving', 'listening', 'articulation', 'adapting', 'feedback'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-bh-i2',
    pool: 'behavioral',
    difficulty: 'intermediate',
    badAnswer: "I'm not sure what skills I have exactly.",
    context: "What unique skills do you bring?",
    idealAnswer: "I bring a combination of analytical thinking, adaptability, and strong problem-solving abilities. My experience has honed my capacity to learn quickly and apply new concepts effectively in practical situations.",
    keywords: ['analytical', 'adaptability', 'problem-solving', 'capacity', 'practical'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Advanced
  {
    id: 'ba-bh-a1',
    pool: 'behavioral',
    difficulty: 'advanced',
    badAnswer: "I can work only when someone pushes me.",
    context: "How do you stay motivated?",
    idealAnswer: "I maintain motivation through a combination of intrinsic goal-setting and external accountability structures. I break long-term objectives into measurable milestones, celebrate small wins, and actively seek challenging projects that push my growth. I've also built a network of mentors and peers who provide constructive feedback and encouragement.",
    keywords: ['intrinsic', 'accountability', 'milestones', 'growth', 'mentors'],
    skillFocus: 'communication',
  },

  // Technical Pool - Beginner
  {
    id: 'ba-tc-b1',
    pool: 'technical',
    difficulty: 'beginner',
    badAnswer: "I learned coding from YouTube, so I'm not perfect.",
    context: "How did you learn programming?",
    idealAnswer: "I developed my programming skills through a combination of self-directed learning and structured practice. Online resources helped me grasp concepts, which I reinforced through hands-on projects and code reviews.",
    keywords: ['self-directed', 'structured', 'reinforced', 'hands-on', 'reviews'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-tc-b2',
    pool: 'technical',
    difficulty: 'beginner',
    badAnswer: "I just tried something in college. Not sure.",
    context: "Tell me about your technical experience",
    idealAnswer: "During my academic career, I gained practical experience through various projects and coursework. I applied theoretical knowledge to build functioning applications, which strengthened my understanding of development principles.",
    keywords: ['practical', 'projects', 'applied', 'theoretical', 'principles'],
    skillFocus: 'communication',
  },

  // Technical Pool - Intermediate
  {
    id: 'ba-tc-i1',
    pool: 'technical',
    difficulty: 'intermediate',
    badAnswer: "I am average at problem-solving.",
    context: "How do you approach problem-solving?",
    idealAnswer: "I follow a systematic approach: understand the problem thoroughly, break it into components, research potential solutions, implement iteratively, and validate through testing. I document my process for future reference and continuous improvement.",
    keywords: ['systematic', 'components', 'iteratively', 'validate', 'document'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-tc-i2',
    pool: 'technical',
    difficulty: 'intermediate',
    badAnswer: "I don't have leadership qualities.",
    context: "Do you have leadership experience?",
    idealAnswer: "I've demonstrated leadership through various project roles where I coordinated team efforts, mentored peers, and drove initiatives to completion. I believe effective leadership is about empowering others and taking ownership of outcomes.",
    keywords: ['coordinated', 'mentored', 'initiatives', 'empowering', 'ownership'],
    skillFocus: 'communication',
  },

  // Technical Pool - Advanced
  {
    id: 'ba-tc-a1',
    pool: 'technical',
    difficulty: 'advanced',
    badAnswer: "I only work well when tasks are simple.",
    context: "How do you handle complex technical challenges?",
    idealAnswer: "I approach complex challenges by first decomposing them into manageable modules. I leverage design patterns and established methodologies to structure my approach, collaborate with domain experts when needed, and use iterative development with continuous testing to ensure quality. I maintain detailed documentation to facilitate knowledge transfer and future maintenance.",
    keywords: ['decomposing', 'design patterns', 'methodologies', 'iterative', 'documentation'],
    skillFocus: 'communication',
  },
  {
    id: 'ba-tc-a2',
    pool: 'technical',
    difficulty: 'advanced',
    badAnswer: "I don't take initiative unless asked.",
    context: "How proactive are you?",
    idealAnswer: "I consistently demonstrate initiative by identifying opportunities for improvement, proposing solutions before being asked, and taking ownership of challenging projects. I stay current with industry trends, proactively share knowledge with my team, and anticipate potential issues to address them preemptively.",
    keywords: ['initiative', 'identifying', 'ownership', 'proactively', 'anticipate'],
    skillFocus: 'communication',
  },
];

// ============================================
// KEYWORD HUNT - TOPIC POOLS
// ============================================

export const keywordTopics: KeywordTopic[] = [
  // Technical Pool - Beginner
  {
    id: 'kh-tc-b1',
    pool: 'technical',
    difficulty: 'beginner',
    title: 'HTML Basics',
    keywords: ['Tag', 'Element', 'Attribute', 'DOCTYPE', 'Head', 'Body', 'Div', 'Span', 'Class', 'ID'],
    bonusKeywords: ['semantic', 'form', 'input', 'anchor', 'hyperlink'],
    category: 'Web Development',
    timeLimit: 45,
  },
  {
    id: 'kh-tc-b2',
    pool: 'technical',
    difficulty: 'beginner',
    title: 'CSS Fundamentals',
    keywords: ['Selector', 'Property', 'Value', 'Margin', 'Padding', 'Border', 'Color', 'Font', 'Display', 'Position'],
    bonusKeywords: ['flexbox', 'grid', 'responsive', 'media query'],
    category: 'Web Development',
    timeLimit: 45,
  },
  {
    id: 'kh-tc-b3',
    pool: 'technical',
    difficulty: 'beginner',
    title: 'JavaScript Basics',
    keywords: ['Variable', 'Function', 'Array', 'Object', 'Loop', 'Condition', 'String', 'Number', 'Boolean', 'Console'],
    bonusKeywords: ['DOM', 'event', 'callback', 'promise'],
    category: 'Programming',
    timeLimit: 45,
  },

  // Technical Pool - Intermediate
  {
    id: 'kh-tc-i1',
    pool: 'technical',
    difficulty: 'intermediate',
    title: 'DBMS - Transactions',
    keywords: ['ACID', 'Atomicity', 'Consistency', 'Isolation', 'Durability', 'Commit', 'Rollback', 'Savepoint', 'Concurrency Control', 'Locking', 'Deadlock', 'Recovery', 'Transaction Log'],
    bonusKeywords: ['two-phase commit', 'serializable', 'dirty read', 'phantom read'],
    category: 'Database',
    timeLimit: 35,
  },
  {
    id: 'kh-tc-i2',
    pool: 'technical',
    difficulty: 'intermediate',
    title: 'Operating System - Deadlocks',
    keywords: ['Deadlock', 'Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Resource Allocation Graph', 'Deadlock Detection', 'Deadlock Prevention', 'Deadlock Avoidance', "Banker's Algorithm"],
    bonusKeywords: ['safe state', 'resource request', 'process scheduling'],
    category: 'Operating Systems',
    timeLimit: 35,
  },
  {
    id: 'kh-tc-i3',
    pool: 'technical',
    difficulty: 'intermediate',
    title: 'OOP Concepts',
    keywords: ['Class', 'Object', 'Inheritance', 'Encapsulation', 'Abstraction', 'Polymorphism', 'Constructor', 'Method Overriding', 'Method Overloading', 'Interface'],
    bonusKeywords: ['abstract class', 'composition', 'aggregation', 'SOLID'],
    category: 'Programming',
    timeLimit: 35,
  },
  {
    id: 'kh-tc-i4',
    pool: 'technical',
    difficulty: 'intermediate',
    title: 'React Fundamentals',
    keywords: ['Component', 'Props', 'State', 'Hook', 'useEffect', 'useState', 'JSX', 'Virtual DOM', 'Render', 'Lifecycle'],
    bonusKeywords: ['context', 'reducer', 'memo', 'ref', 'suspense'],
    category: 'Frontend',
    timeLimit: 35,
  },

  // Technical Pool - Advanced
  {
    id: 'kh-tc-a1',
    pool: 'technical',
    difficulty: 'advanced',
    title: 'System Design Concepts',
    keywords: ['Scalability', 'Load Balancer', 'Caching', 'CDN', 'Microservices', 'API Gateway', 'Message Queue', 'Database Sharding', 'Replication', 'Consistency', 'CAP Theorem', 'Rate Limiting'],
    bonusKeywords: ['eventual consistency', 'distributed system', 'fault tolerance', 'circuit breaker'],
    category: 'Architecture',
    timeLimit: 30,
  },
  {
    id: 'kh-tc-a2',
    pool: 'technical',
    difficulty: 'advanced',
    title: 'DSA - Sorting Algorithms',
    keywords: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort', 'Insertion Sort', 'Heap Sort', 'Time Complexity', 'Space Complexity', 'Stable Sorting', 'Divide and Conquer', 'In-place', 'Comparison Sort'],
    bonusKeywords: ['radix sort', 'counting sort', 'bucket sort', 'external sorting'],
    category: 'Data Structures',
    timeLimit: 30,
  },
  {
    id: 'kh-tc-a3',
    pool: 'technical',
    difficulty: 'advanced',
    title: 'Cybersecurity - Authentication',
    keywords: ['Authentication', 'Authorization', 'MFA', 'OTP', 'Biometrics', 'Password Hashing', 'Tokens', 'Session Management', 'OAuth', 'SAML', 'JWT', 'RBAC'],
    bonusKeywords: ['zero trust', 'SSO', 'LDAP', 'Kerberos'],
    category: 'Security',
    timeLimit: 30,
  },
  {
    id: 'kh-tc-a4',
    pool: 'technical',
    difficulty: 'advanced',
    title: 'Computer Networks - TCP/IP',
    keywords: ['TCP', 'UDP', 'IP Address', 'Subnet', 'Routing', 'Handshake', 'Checksum', 'OSI Model', 'Transport Layer', 'Network Layer', 'Port', 'Socket'],
    bonusKeywords: ['NAT', 'DHCP', 'DNS', 'firewall', 'VPN'],
    category: 'Networking',
    timeLimit: 30,
  },

  // HR/Behavioral Pool - Intermediate
  {
    id: 'kh-hr-i1',
    pool: 'hr',
    difficulty: 'intermediate',
    title: 'Leadership Qualities',
    keywords: ['Vision', 'Communication', 'Delegation', 'Motivation', 'Decision Making', 'Accountability', 'Empathy', 'Integrity', 'Adaptability', 'Conflict Resolution'],
    bonusKeywords: ['mentorship', 'emotional intelligence', 'strategic thinking'],
    category: 'Soft Skills',
    timeLimit: 35,
  },
  {
    id: 'kh-hr-i2',
    pool: 'behavioral',
    difficulty: 'intermediate',
    title: 'STAR Method Components',
    keywords: ['Situation', 'Task', 'Action', 'Result', 'Context', 'Challenge', 'Approach', 'Outcome', 'Impact', 'Learning'],
    bonusKeywords: ['quantifiable', 'measurable', 'specific', 'timeline'],
    category: 'Interview Skills',
    timeLimit: 35,
  },
];

// ============================================
// REPHRASE ME - SENTENCE POOLS
// ============================================

export const rephraseSentences: RephraseSentence[] = [
  // HR Pool - Beginner
  {
    id: 'rp-hr-b1',
    pool: 'hr',
    difficulty: 'beginner',
    original: "I worked on some projects.",
    idealRewrite: "I successfully planned and executed several academic and technical projects, taking responsibility for research, development, and delivery while collaborating with my team to achieve strong outcomes.",
    keyImprovements: ['Added specific details', 'Used action verbs', 'Showed responsibility'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-hr-b2',
    pool: 'hr',
    difficulty: 'beginner',
    original: "I know basic coding only.",
    idealRewrite: "I have foundational programming knowledge and am actively expanding my technical skills through hands-on projects, coursework, and self-directed learning to build comprehensive development capabilities.",
    keyImprovements: ['Positive framing', 'Shows growth mindset', 'Mentions specific activities'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-hr-b3',
    pool: 'hr',
    difficulty: 'beginner',
    original: "I helped my team sometimes.",
    idealRewrite: "I actively contributed to team success by providing technical support, sharing knowledge, and collaborating on key deliverables to ensure project milestones were met effectively.",
    keyImprovements: ['Quantified contribution', 'Professional vocabulary', 'Result-oriented'],
    skillFocus: 'communication',
  },

  // HR Pool - Intermediate
  {
    id: 'rp-hr-i1',
    pool: 'hr',
    difficulty: 'intermediate',
    original: "I did an internship for a bit.",
    idealRewrite: "I completed a focused internship where I gained practical industry experience, developed professional skills, and contributed meaningfully to real-world projects while learning from experienced mentors.",
    keyImprovements: ['Specific timeframe implied', 'Highlights learning', 'Professional tone'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-hr-i2',
    pool: 'hr',
    difficulty: 'intermediate',
    original: "I don't have much experience.",
    idealRewrite: "While I'm early in my professional journey, I bring fresh perspectives, strong foundational knowledge, and demonstrated ability to learn quickly and adapt to new challenges.",
    keyImprovements: ['Reframes weakness as strength', 'Confident tone', 'Highlights adaptability'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-hr-i3',
    pool: 'hr',
    difficulty: 'intermediate',
    original: "I am good with people.",
    idealRewrite: "I excel in interpersonal communication, building collaborative relationships, and facilitating productive team dynamics to achieve shared objectives and maintain positive working environments.",
    keyImprovements: ['Specific examples', 'Professional language', 'Outcome-focused'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Beginner
  {
    id: 'rp-bh-b1',
    pool: 'behavioral',
    difficulty: 'beginner',
    original: "I like solving problems.",
    idealRewrite: "I thrive on analyzing complex challenges, developing innovative solutions, and applying systematic problem-solving methodologies to deliver effective results under pressure.",
    keyImprovements: ['Specific approach', 'Action-oriented', 'Shows capability'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-bh-b2',
    pool: 'behavioral',
    difficulty: 'beginner',
    original: "I did many tasks in college.",
    idealRewrite: "Throughout my academic career, I successfully managed diverse responsibilities including coursework, projects, leadership roles, and extracurricular activities while maintaining high performance standards.",
    keyImprovements: ['Organized structure', 'Shows multitasking', 'Professional presentation'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Intermediate
  {
    id: 'rp-bh-i1',
    pool: 'behavioral',
    difficulty: 'intermediate',
    original: "I tried to learn new things.",
    idealRewrite: "I actively pursue continuous learning opportunities, staying current with industry trends and expanding my skill set through structured courses, hands-on practice, and professional development initiatives.",
    keyImprovements: ['Shows initiative', 'Specific methods', 'Growth-oriented'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-bh-i2',
    pool: 'behavioral',
    difficulty: 'intermediate',
    original: "I did a project on websites.",
    idealRewrite: "I designed and developed comprehensive web applications using modern technologies, implementing user-friendly interfaces, robust functionality, and responsive design principles to deliver professional solutions.",
    keyImprovements: ['Technical specifics', 'Process description', 'Quality focus'],
    skillFocus: 'communication',
  },

  // Behavioral Pool - Advanced
  {
    id: 'rp-bh-a1',
    pool: 'behavioral',
    difficulty: 'advanced',
    original: "I know Java but not very well.",
    idealRewrite: "I have working knowledge of Java programming fundamentals including object-oriented principles, data structures, and basic algorithms. I'm committed to strengthening my expertise through advanced coursework, practical projects, and adopting industry best practices.",
    keyImprovements: ['Honest yet confident', 'Specific skills mentioned', 'Growth plan'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-bh-a2',
    pool: 'behavioral',
    difficulty: 'advanced',
    original: "I did some leadership work.",
    idealRewrite: "I demonstrated leadership capabilities by guiding team initiatives, mentoring peers, coordinating project activities, and driving collaborative efforts to achieve successful outcomes. I consistently take ownership of challenges and empower team members to contribute their best work.",
    keyImprovements: ['Specific leadership actions', 'Impact demonstrated', 'Professional vocabulary'],
    skillFocus: 'communication',
  },

  // Technical Pool - Intermediate
  {
    id: 'rp-tc-i1',
    pool: 'technical',
    difficulty: 'intermediate',
    original: "I managed my time okay.",
    idealRewrite: "I effectively prioritize multiple responsibilities, organize workflows systematically using tools like task managers and calendars, and maintain consistent productivity while meeting deadlines and quality standards across various commitments.",
    keyImprovements: ['Specific methods', 'Tools mentioned', 'Result-oriented'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-tc-i2',
    pool: 'technical',
    difficulty: 'intermediate',
    original: "I handled responsibilities in class.",
    idealRewrite: "I successfully fulfilled academic leadership roles including class representative and project coordinator, managing group activities, facilitating communication between students and faculty, and ensuring team deliverables met quality standards.",
    keyImprovements: ['Specific roles', 'Detailed responsibilities', 'Demonstrated impact'],
    skillFocus: 'communication',
  },

  // Technical Pool - Advanced
  {
    id: 'rp-tc-a1',
    pool: 'technical',
    difficulty: 'advanced',
    original: "I know a little about databases.",
    idealRewrite: "I have foundational database knowledge including relational design principles, SQL query optimization, normalization concepts, and data modeling. I'm actively developing advanced skills in database administration, performance tuning, and implementing scalable data solutions.",
    keyImprovements: ['Specific concepts', 'Technical depth', 'Learning trajectory'],
    skillFocus: 'communication',
  },
  {
    id: 'rp-tc-a2',
    pool: 'technical',
    difficulty: 'advanced',
    original: "I know how to debug issues.",
    idealRewrite: "I possess strong analytical and troubleshooting skills, systematically identifying root causes through methodical debugging approaches, log analysis, and testing strategies. I implement effective solutions, document findings for knowledge sharing, and establish preventive measures to minimize recurring issues.",
    keyImprovements: ['Systematic approach', 'Specific techniques', 'Documentation focus'],
    skillFocus: 'communication',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getQuestionsByDifficulty = <T extends { difficulty: DifficultyLevel }>(
  questions: T[],
  difficulty: DifficultyLevel
): T[] => {
  return questions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByPool = <T extends { pool: QuestionPool }>(
  questions: T[],
  pool: QuestionPool
): T[] => {
  return questions.filter(q => q.pool === pool);
};

export const getRandomQuestion = <T extends { id: string }>(
  questions: T[],
  excludeIds: string[] = []
): T | null => {
  const available = questions.filter(q => !excludeIds.includes(q.id));
  if (available.length === 0) {return null;}
  
return available[Math.floor(Math.random() * available.length)];
};

export const getFilteredQuestions = <T extends { difficulty: DifficultyLevel; pool: QuestionPool }>(
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

// Difficulty display helpers
export const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const difficultyColors: Record<DifficultyLevel, { text: string; bg: string; border: string }> = {
  beginner: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  intermediate: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  advanced: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

// XP and Level calculations
export const getXpForScore = (score: number, difficulty: DifficultyLevel): number => {
  const baseXp = Math.round(score * 10);
  const multipliers: Record<DifficultyLevel, number> = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
  };
  
return Math.round(baseXp * multipliers[difficulty]);
};

export const getLevelFromXp = (xp: number, xpPerLevel: number = 500): number => {
  return Math.floor(xp / xpPerLevel) + 1;
};

export const getXpProgress = (xp: number, xpPerLevel: number = 500): { current: number; needed: number; percentage: number } => {
  const current = xp % xpPerLevel;
  
return {
    current,
    needed: xpPerLevel - current,
    percentage: (current / xpPerLevel) * 100,
  };
};

// ============================================
// GAME 4: ANSWER BUILDER - SENTENCE BLOCKS
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

export const answerBuilderQuestions: AnswerBuilderQuestion[] = [
  // Beginner - HR
  {
    id: 'ab-hr-b1',
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
    id: 'ab-hr-b2',
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
    id: 'ab-hr-b3',
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

  // Intermediate - Behavioral
  {
    id: 'ab-bh-i1',
    pool: 'behavioral',
    difficulty: 'intermediate',
    interviewQuestion: 'Describe a challenging project you worked on.',
    blocks: [
      'The project had a tight two-week deadline.',
      'I led a team of four developers',
      'We implemented daily standups and sprint planning.',
      'As a result, we delivered on time with zero critical bugs.',
      'I learned the importance of agile methodologies.',
    ],
    correctOrder: [0, 1, 2, 3, 4],
    idealAnswer: 'The project had a tight two-week deadline. I led a team of four developers and we implemented daily standups and sprint planning. As a result, we delivered on time with zero critical bugs. I learned the importance of agile methodologies.',
    explanation: 'STAR method: Situation → Task/Action → Action details → Result → Learning.',
    skillFocus: 'communication',
  },
  {
    id: 'ab-bh-i2',
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
    id: 'ab-bh-i3',
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

  // Advanced - Technical
  {
    id: 'ab-tc-a1',
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
    id: 'ab-tc-a2',
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
    id: 'ab-tc-a3',
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
];

// ============================================
// GAME 5: KEYWORD → ANSWER MAPPING
// ============================================

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

export const keywordMappingQuestions: KeywordMappingQuestion[] = [
  // Beginner
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

  // Intermediate
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

  // Advanced
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
];

// ============================================
// GAME 6: TRUTH OR BLUFF
// ============================================

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

export const truthOrBluffStatements: TruthOrBluffStatement[] = [
  // Beginner
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

  // Intermediate
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

  // Advanced
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
];

// Helper functions for new games
export const getAnswerBuilderQuestions = (difficulty?: DifficultyLevel, pool?: QuestionPool) => {
  return getFilteredQuestions(answerBuilderQuestions, difficulty, pool);
};

export const getKeywordMappingQuestions = (difficulty?: DifficultyLevel, pool?: QuestionPool) => {
  return getFilteredQuestions(keywordMappingQuestions, difficulty, pool);
};

export const getTruthOrBluffStatements = (difficulty?: DifficultyLevel, pool?: QuestionPool) => {
  return getFilteredQuestions(truthOrBluffStatements, difficulty, pool);
};

